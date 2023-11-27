import { ApiError, Fetcher } from './fetcher/index.mjs';

import type { paths } from './types.mjs';
import type { FetchConfig } from './fetcher/types.mjs';
import * as Sentry from '@sentry/node';
import { CaptureConsole } from '@sentry/integrations';
import { normalizeEnvironmentName } from './utils.mjs';

export { ApiError };
export type { paths };

const PlaytApiClient = function ({
  apiKey,
  apiUrl,
}: {
  apiKey: string;
  apiUrl: string;
}) {
  const fetcher = Fetcher.for<paths>();
  const config: FetchConfig = {
    baseUrl: apiUrl,
    use: [],
  };
  if (typeof apiKey !== 'undefined') {
    config.init = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'User-Agent': `playt-client/${process.env.npm_package_version}`,
        'Content-Type': 'application/json',
      },
    };
  }
  fetcher.configure(config);

  const initialize = async ({ gameVersion }: { gameVersion: string }) => {
    Sentry.init({
      dsn: 'https://9d84d42a72c0a9cd7001d6d4e369275d@o4504684409782272.ingest.sentry.io/4506304617578496',
      release: gameVersion,
      environment: normalizeEnvironmentName(new URL(apiUrl)),
      tracesSampleRate: 1,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
        new CaptureConsole(),
      ],
      // TODO fetch dsn and tracesSampleRate from game metadata
    });
  };

  const searchMatch = fetcher
    .path('/api/matches/search')
    .method('post')
    .create();
  const submitScore = fetcher
    .path('/api/matches/scores')
    .method('post')
    .create();
  const quitMatch = fetcher.path('/api/matches/quit').method('post').create();
  const submitReplay = fetcher.path('/api/replays').method('post').create();
  const getReplay = fetcher.path('/api/replays').method('get').create();

  const submitScoreWithTimestamp = ({
    timestamp = new Date().toISOString(),
    ...args
  }: Parameters<typeof submitScore>[0]) => submitScore({ timestamp, ...args });

  return {
    initialize,
    fetcher,
    searchMatch,
    submitScore: submitScoreWithTimestamp,
    /**
     * @deprecated Use submitScore instead
     */
    submitTutorialScore: submitScoreWithTimestamp,
    submitReplay,
    getReplay,
    quitMatch,
  };
};
export default PlaytApiClient;
