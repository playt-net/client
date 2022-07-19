import { ApiError, Fetcher } from 'openapi-typescript-fetch';

import type { paths } from './types';

export { ApiError };

const PlaytClient = function (apiUrl = 'https://fun-fair.vercel.app') {
  const fetcher = Fetcher.for<paths>();

  fetcher.configure({
    baseUrl: apiUrl,
    init: {
      headers: {
        'Content-Type': 'application/json',
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
