import { Fetcher } from 'openapi-typescript-fetch';
import type { paths } from './types';

const fetcher = Fetcher.for<paths>();

fetcher.configure({
  baseUrl: 'https://playt-backend-xbwjl.ondigitalocean.app/v3',
  init: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  use: [],
});

export default fetcher;
