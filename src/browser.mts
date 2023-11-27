import { Fetcher } from './fetcher/fetcher.mjs';
import { FetchConfig } from './fetcher/types.mjs';
import { paths } from './types.mjs';
import * as Sentry from '@sentry/browser';
import { CaptureConsole } from '@sentry/integrations';
import { normalizeEnvironmentName } from './utils.mjs';

const PlaytBrowserClient = ({ apiUrl }: { apiUrl: string }) => {
  const fetcher = Fetcher.for<paths>();
  const config: FetchConfig = {
    baseUrl: apiUrl,
    use: [],
    init: {
      headers: {
        'User-Agent': `playt-browser-client/${process.env.npm_package_version}`,
      },
    },
  };
  fetcher.configure(config);

  const initialize = async ({ gameVersion }: { gameVersion: string }) => {
    Sentry.init({
      dsn: 'https://9d84d42a72c0a9cd7001d6d4e369275d@o4504684409782272.ingest.sentry.io/4506304617578496',
      release: gameVersion,
      environment: normalizeEnvironmentName(new URL(apiUrl)),
      integrations: [new Sentry.BrowserTracing(), new CaptureConsole()],
      tracesSampleRate: 1,
      replaysSessionSampleRate: 0.001,
      replaysOnErrorSampleRate: 0.1,
      // TODO fetch dsn and sample rates from game metadata
    });
  };

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

  return { initialize, startMatch, stopMatch };
};

export default PlaytBrowserClient;
