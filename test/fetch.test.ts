import { ApiError } from 'openapi-typescript-fetch';
import 'whatwg-fetch';
import {
  deleteBasket,
  deleteGame,
  deleteGameApiKey,
  deleteMatch,
  deletePurchasable,
  getBasket,
  getCurrentUser,
  getGame,
  getGames,
  getMatch,
  getMatches,
  getPurchasable,
  getPurchasables,
  getReplay,
  getTutorial,
  getTutorials,
  getUser,
  getWallet,
  patchBasketItems,
  patchCurrentUser,
  postAuthRefresh,
  postBasketItems,
  postCheckoutFast,
  postGame,
  postLogin,
  postMatchJoin,
  postPurchasable,
  postRegister,
  postReplay,
  postScore,
  postTutorial,
  putCurrentUser,
  putGame,
  putGameApiKey,
  putPurchasable,
  putTutorial,
} from '../src/index';

/**
 * These tests should not replace backend tests, but make sure that the services are available.
 */
describe('fetch', () => {
  it('postRegister', async () => {
    try {
      await postRegister({
        email: 'invalid_mail',
        password: 'pw',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(409);
      expect(statusText).toBe('Conflict');
    }
  });
  it('postAuthRefresh', async () => {
    try {
      await postAuthRefresh({
        refreshToken: 'fail!',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(409);
      expect(statusText).toBe('Conflict');
    }
  });
  it('postLogin', async () => {
    try {
      await postLogin({
        email: 'invalid_mail',
        password: 'pw',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(409);
      expect(statusText).toBe('Conflict');
    }
  });
  it('getCurrentUser', async () => {
    try {
      await getCurrentUser({});
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('putCurrentUser', async () => {
    try {
      await putCurrentUser({
        username: '',
        firstname: '',
        lastname: '',
        avatarUrl: '',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('patchCurrentUser', async () => {
    try {
      await patchCurrentUser({
        username: '',
        avatarUrl: '',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getUser', async () => {
    try {
      await getUser({ id: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getTutorials', async () => {
    try {
      await getTutorials({ gameId: '1', pageable: {} });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postTutorial', async () => {
    try {
      await postTutorial({ gameId: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getTutorial', async () => {
    try {
      await getTutorial({ id: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('putTutorial', async () => {
    try {
      await putTutorial({ id: '1', finished: true });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getPurchasables', async () => {
    const { ok, status, statusText, data } = await getPurchasables({
      pageable: {},
    });
    expect(data.empty).toEqual(false);
    expect(ok).toBe(true);
    expect(status).toBe(200);
    expect(statusText).toBe('OK');
  });
  it('postPurchasable', async () => {
    try {
      await postPurchasable({
        title: '',
        description: '',
        iconUrl: '',
        bannerUrl: '',
        type: '',
        price: 1,
        amount: 1,
        properties: {},
        tags: [],
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getPurchasable', async () => {
    try {
      await getPurchasable({
        id: '-1',
      });
      throw Error('Should fail for not existing item');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(404);
      expect(statusText).toBe('Not Found');
    }
  });
  it('putPurchasable', async () => {
    try {
      await putPurchasable({
        id: '0',
        title: '',
        description: '',
        iconUrl: '',
        bannerUrl: '',
        type: '',
        price: 1,
        amount: 1,
        properties: {},
        tags: [],
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deletePurchasable', async () => {
    try {
      await deletePurchasable({
        id: '0',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getGames', async () => {
    const { ok, status, statusText, data } = await getGames({ pageable: {} });
    expect(data.empty).toEqual(false);
    expect(ok).toBe(true);
    expect(status).toBe(200);
    expect(statusText).toBe('OK');
  });
  it('postGame', async () => {
    try {
      await postGame({ title: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getGame', async () => {
    try {
      await getGame({
        id: '-1',
      });
      throw Error('Should fail for not existing item');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(404);
      expect(statusText).toBe('Not Found');
    }
  });
  it('putGame', async () => {
    try {
      await putGame({ id: '-1', title: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deleteGame', async () => {
    try {
      await deleteGame({ id: '-1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('putGameApiKey', async () => {
    try {
      await putGameApiKey({ id: '-1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deleteGameApiKey', async () => {
    try {
      await deleteGameApiKey({ id: '-1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getMatches', async () => {
    try {
      await getMatches({ playerToken: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getMatch', async () => {
    try {
      await getMatch({ id: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deleteMatch', async () => {
    try {
      await deleteMatch({ id: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postMatchJoin', async () => {
    try {
      await postMatchJoin({ playerToken: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getReplay', async () => {
    try {
      await getReplay({
        matchId: '1',
        userId: '1',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postReplay', async () => {
    try {
      await postReplay({ matchId: '1', userId: '1', payload: 'a' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postScore', async () => {
    try {
      await postScore({ id: '1', playerToken: '1', score: 1 });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getBasket', async () => {
    try {
      await getBasket({});
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deleteBasket', async () => {
    try {
      await deleteBasket({});
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postBasketItems', async () => {
    try {
      await postBasketItems({ purchasableId: '1', amount: 1 });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('patchBasketItems', async () => {
    try {
      await patchBasketItems({ purchasableId: '1', amount: 1 });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postCheckoutFast', async () => {
    try {
      await postCheckoutFast({ purchasableId: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getWallet', async () => {
    try {
      await getWallet({});
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
});
