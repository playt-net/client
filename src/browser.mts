import { Fetcher } from './fetcher/fetcher.mjs';
import type { FetchConfig } from './fetcher/types.mjs';
import type { paths } from './types.mjs';
import * as Sentry from '@sentry/browser';
import { CaptureConsole } from '@sentry/integrations';
import { normalizeEnvironmentName } from './utils.mjs';

const PlaytBrowserClient = ({
  gameId,
  apiUrl,
}: {
  gameId: string;
  apiUrl: string;
}) => {
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

  const emitEvent = (message: "started-match" | "stopped-match" | "initialized" | "can-exit") => {
    window.parent.postMessage(
      {
        source: 'iframe',
        message,
      },
      new URL(apiUrl).origin,
    );
  }

  const initialize = async ({ gameVersion }: { gameVersion: string }) => {
    const sentryConfigResp = await fetcher
      .path('/api/games/{gameId}/sentry-config')
      .method('get')
      .create()({ gameId });
    if (!sentryConfigResp.ok) {
      console.error(
        'Failed to fetch Sentry config, error tracking will not work'
      );
    }
    Sentry.init({
      ...sentryConfigResp.data,
      dsn: sentryConfigResp.data.dsn ?? undefined,
      release: gameVersion,
      environment: normalizeEnvironmentName(new URL(apiUrl)),
      integrations: [new Sentry.BrowserTracing(), new CaptureConsole()],
    });

    emitEvent('initialized');
  };

  async function setupAnybrain() {
    const anybrainEvent = new Promise<DocumentEventMap['anybrain']>(
      (resolve) => {
        document.addEventListener('anybrain', (event) => {
          resolve(event);
        });
      }
    );
    const anybrain = await import("@playt/anybrain-sdk");
    const event = await anybrainEvent;

    if (event.detail.loadModuleSuccess()) {
      return anybrain;
    }
    throw new Error(
      `Anybrain SDK failed to load. Error code: ${event.detail.error}`
    );
  }
  const anybrainPromise = setupAnybrain();
  
  const startMatch = async (
    userId: string,
    matchId: string,
    playerToken: string
  ) => {
    const antiCheatConfigResp = await fetcher
      .path('/api/games/{gameId}/anti-cheat-config')
      .method('get')
      .create()({ gameId });
    if (!antiCheatConfigResp.ok) {
      throw new Error('Failed to fetch anti-cheat config');
    }
    const { gameKey, gameSecret } = antiCheatConfigResp.data;
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

    AnybrainStartMatch(matchId);

    emitEvent('started-match');
  };

  const stopMatch = async () => {
    const { AnybrainStopSDK } = await anybrainPromise;
    AnybrainStopSDK();

    emitEvent('stopped-match');
  };

  /**
   * Will emit a message to the parent window to indicate that the game is ready to exit.
   * The parent window will then close the iframe.
   */
  const exit = () => {
    emitEvent('can-exit');
  }

  return { initialize, startMatch, stopMatch, exit };
};

export default PlaytBrowserClient;
