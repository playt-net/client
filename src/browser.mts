import { getEnv } from './env.mjs';
import { Fetcher } from './fetcher/fetcher.mjs';
import { FetchConfig } from './fetcher/types.mjs';
import { paths } from './types.mjs';
import * as Sentry from "@sentry/browser";

const PlaytBrowserClient = ({ apiUrl }: { apiUrl: string }) => {
  const env = getEnv();

  Sentry.init({
    dsn: env.sentry_dsn,
    release: env.release,
    environment: env.environment,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });

  const fetcher = Fetcher.for<paths>();
  const config: FetchConfig = {
    baseUrl: apiUrl,
    use: [],
  };
  fetcher.configure(config);

  async function setupAnybrain() {
    const anybrainEvent = new Promise<DocumentEventMap['anybrain']>(
      (resolve) => {
        document.addEventListener('anybrain', (event) => {
          resolve(event);
        });
      }
    );
    const anybrain = await import(`@playt/anybrain-sdk`);
    const event = await anybrainEvent;

    if (event.detail.loadModuleSuccess()) {
      return anybrain;
    } else {
      throw new Error(
        `Anybrain SDK failed to load. Error code: ${event.detail.error}`
      );
    }
  }
  const anybrainPromise = setupAnybrain();

  const startMatch = async (
    userId: string,
    matchId: string,
    playerToken: string
  ) => {
    const matchResp = await fetcher
      .path('/api/matches/{matchId}')
      .method('get')
      .create()({ matchId });
    if (!matchResp.ok) {
      throw new Error(
        `Failed to fetch match with id ${matchId}. ${matchResp.status} ${matchResp.statusText}`
      );
    }
    const { gameKey, gameSecret } = matchResp.data.game.antiCheat;
    const {
      AnybrainSetCredentials,
      AnybrainSetUserId,
      AnybrainStartMatch,
      AnybrainStartSDK,
      AnybrainSetPlayerToken,
    } = await anybrainPromise;
    AnybrainSetCredentials(gameKey, gameSecret);
    AnybrainSetUserId(userId);
    AnybrainSetPlayerToken(playerToken);
    AnybrainStartSDK();
    return AnybrainStartMatch(matchId);
  };

  const stopMatch = async () => {
    const { AnybrainStopSDK } = await anybrainPromise;
    return AnybrainStopSDK();
  };

  return { startMatch, stopMatch };
};

export default PlaytBrowserClient;
