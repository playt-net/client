import { ApiError, Fetcher } from './fetcher/index.mjs';

import type { paths } from './types.mjs';
import type { FetchConfig } from './fetcher/types.mjs';
import * as Sentry from "@sentry/node";
import { getEnv } from './env.mjs';

export { ApiError };
export type { paths };

const PlaytApiClient = function ({
  apiKey,
  apiUrl,
}: {
  apiKey: string;
  apiUrl: string;
}) {
  const env = getEnv();
  Sentry.init({
    dsn: env.sentry_dsn,
    release: env.release,
    environment: env.environment,  
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
  const fetcher = Fetcher.for<paths>();
  const config: FetchConfig = {
    baseUrl: apiUrl,
    use: [],
  };
  if (typeof apiKey !== 'undefined') {
    config.init = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
    };
  }
  fetcher.configure(config);

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
