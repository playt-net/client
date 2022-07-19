import { ApiError, Fetcher, Middleware } from './fetcher/index.js';

import type { paths } from './types.js';

export { ApiError };

const PlaytClient = function (
  apiUrl = 'https://fun-fair.vercel.app',
  apiKey = ''
) {
  const fetcher = Fetcher.for<paths>();

  const authenticate: Middleware = async (url, init, next) => {
    init.headers.set('Authorization', apiKey);
    return next(url, init);
  };

  fetcher.configure({
    baseUrl: apiUrl,
    init: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    use: [authenticate],
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
