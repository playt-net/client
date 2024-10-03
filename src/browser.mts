import { Fetcher } from './fetcher/fetcher.mjs';
import { FetchConfig } from './fetcher/types.mjs';
import { operations, paths } from './types.mjs';
import * as Sentry from '@sentry/browser';
import { CaptureConsole } from '@sentry/integrations';
import { normalizeEnvironmentName } from './utils.mjs';

const PlaytBrowserClient = ({
  gameId,
  apiUrl,
  playerToken
}: {
  gameId: string;
  apiUrl: string;
  playerToken: string;
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

  const initialize = async ({ gameVersion }: { gameVersion: string }) => {
    const sentryConfigResp = await fetcher
      .path('/api/games/{gameId}/sentry-config')
      .method('get')
      .create()({ gameId });
    if (!sentryConfigResp.ok) {
      console.error(
        'Failed to fetch Sentry config, error tracking will not work',
      );
    }
    Sentry.init({
      ...sentryConfigResp.data,
      dsn: sentryConfigResp.data.dsn ?? undefined,
      release: gameVersion,
      environment: normalizeEnvironmentName(new URL(apiUrl)),
      integrations: [new Sentry.BrowserTracing(), new CaptureConsole(sentryConfigResp.data.integrations?.captureConsole)],
    });
  };

  const setupAnybrain = async () => {
    const anybrainEvent = new Promise<DocumentEventMap['anybrain']>(
      (resolve) => {
        document.addEventListener('anybrain', (event) => {
          resolve(event);
        });
      },
    );
    const anybrain = await import(`@playt/anybrain-sdk`);
    const event = await anybrainEvent;

    if (event.detail.loadModuleSuccess()) {
      return anybrain;
    } else {
      throw new Error(
        `Anybrain SDK failed to load. Error code: ${event.detail.error}`,
      );
    }
  }
  const anybrainPromise = setupAnybrain();

  const startMatch = async (
    userId: string,
    matchId: string,
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
    return AnybrainStartMatch(matchId);
  };

  const stopMatch = async () => {
    const { AnybrainStopSDK } = await anybrainPromise;
    return AnybrainStopSDK();
  };

  const reportFatalError = async (error: unknown) => {
    window.parent.postMessage({ type: 'error', error }, new URL(apiUrl).origin);
    console.warn('Reporting error:', error);
  }

  const updatePlayerSettings = async (userSettings: Omit<operations["updateSettings"]["requestBody"]["content"]["application/json"], "playerToken">) => {
    await fetcher
      .path('/api/user/settings')
      .method('post')
      .create()({ playerToken, ...userSettings })
  }

  return { initialize, startMatch, stopMatch, reportFatalError, updatePlayerSettings };
};

export default PlaytBrowserClient;
