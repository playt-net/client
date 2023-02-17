import { ApiError, Fetcher } from './fetcher/index.mjs';

import type { paths } from './types.mjs';
import type { FetchConfig } from './fetcher/types.mjs';

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
  const submitTutorialScore = fetcher
    .path('/api/tutorials/scores')
    .method('post')
    .create();
  const submitReplay = fetcher.path('/api/replays').method('post').create();
  const getReplay = fetcher.path('/api/replays').method('get').create();

  return {
    fetcher,
    searchMatch,
    submitScore,
    submitTutorialScore,
    submitReplay,
    getReplay,
    quitMatch,
  };
};
export default PlaytApiClient;
