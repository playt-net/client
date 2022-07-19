import { ApiError, Fetcher } from 'openapi-typescript-fetch';

import type { paths } from './types';

export { ApiError };

const fetcher = Fetcher.for<paths>();

fetcher.configure({
  baseUrl: 'https://fun-fair.vercel.app',
  init: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  use: [],
});

export const searchMatch = fetcher
  .path('/api/matches/search')
  .method('post')
  .create();
export const submitScore = fetcher
  .path('/api/matches/scores')
  .method('post')
  .create();
export const submitReplay = fetcher
  .path('/api/replays')
  .method('post')
  .create();
export const getReplay = fetcher.path('/api/replays').method('get').create();
