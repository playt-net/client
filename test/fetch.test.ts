import 'whatwg-fetch';
import { getGames } from '../src/index';

describe('fetch', () => {
  it('GET /games', async () => {
    const { ok, status, statusText, data } = await getGames({});

    expect(data.empty).toEqual(false);
    expect(ok).toBe(true);
    expect(status).toBe(200);
    expect(statusText).toBe('OK');
  });
});
