import { ApiError, Fetcher } from './fetcher/index.js';

import type { paths } from './types.js';

export { ApiError };

const PlaytClient = function (
  apiKey: string,
  apiUrl = 'https://fun-fair.vercel.app'
) {
  const fetcher = Fetcher.for<paths>();

  fetcher.configure({
    baseUrl: apiUrl,
    init: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
    },
    use: [],
  });

  const searchMatch = fetcher
    .path('/api/matches/search')
    .method('post')
    .create();
  const submitScore = fetcher
    .path('/api/matches/scores')
    .method('post')
    .create();
  const submitReplay = fetcher.path('/api/replays').method('post').create();
  const getReplay = fetcher.path('/api/replays').method('get').create();

  return {
    fetcher,
    searchMatch,
    submitScore,
    submitReplay,
    getReplay,
  };
};

export default PlaytClient;
