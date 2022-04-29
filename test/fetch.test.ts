import { ApiError } from 'openapi-typescript-fetch';
import 'whatwg-fetch';
import { PlaytClient } from '../src/index';

const client = PlaytClient({
  clientCredentials: {
    clientId: 'API_CLIENT_ID',
    clientSecret: 'API_CLIENT_SECRET',
  },
});
/**
 * These tests should not replace backend tests, but make sure that the services are available.
 */
describe('fetch', () => {
  it('postRegister', async () => {
    try {
      await client.postRegister({
        email: 'invalid_mail',
        password: 'pw',
        accountType: 'player',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postAuthRefresh', async () => {
    try {
      await client.postAuthRefresh({
        refreshToken: 'fail!',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postLogin', async () => {
    try {
      await client.postLogin({
        email: 'invalid_mail',
        password: 'pw',
      });
      throw Error('Should fail with invalid crendentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getCurrentUser', async () => {
    try {
      await client.getCurrentUser({});
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('putCurrentUser', async () => {
    try {
      await client.putCurrentUser({
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
  it('patchCurrentUser', async () => {
    try {
      await client.patchCurrentUser({
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
      await client.getUser({ id: '1' });
      throw Error('Should fail for unknown user');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(404);
      expect(statusText).toBe('Not Found');
    }
  });
  it('getTutorials', async () => {
    try {
      await client.getTutorials({ gameId: '1', pageable: {} });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postTutorial', async () => {
    try {
      await client.postTutorial({ gameId: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getTutorial', async () => {
    try {
      await client.getTutorial({ id: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('putTutorial', async () => {
    try {
      await client.putTutorial({ id: '1', finished: true });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getPurchasables', async () => {
    const { ok, status, statusText, data } = await client.getPurchasables({});
    expect(data.empty).toEqual(false);
    expect(ok).toBe(true);
    expect(status).toBe(200);
    expect(statusText).toBe('OK');
  });
  it('postPurchasable', async () => {
    try {
      await client.postPurchasable({
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
      await client.getPurchasable({
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
      await client.putPurchasable({
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
      await client.deletePurchasable({
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
    const { ok, status, statusText, data } = await client.getGames({});
    expect(data.empty).toEqual(false);
    expect(ok).toBe(true);
    expect(status).toBe(200);
    expect(statusText).toBe('OK');
  });
  it('postGame', async () => {
    try {
      await client.postGame({
        title: '',
        subtitle: '',
        iconUrl: '',
        bannerUrl: '',
        description: '',
        gameUrl: '',
        tutorialVideoUrl: '',
        genre: '',
        matchTiers: [],
        tags: [],
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getGame', async () => {
    try {
      await client.getGame({
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
      await client.putGame({
        id: '-1',
        title: '',
        subtitle: '',
        iconUrl: '',
        bannerUrl: '',
        description: '',
        gameUrl: '',
        tutorialVideoUrl: '',
        genre: '',
        matchTiers: [],
        tags: [],
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deleteGame', async () => {
    try {
      await client.deleteGame({ id: '-1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('putGameApiKey', async () => {
    try {
      await client.putGameApiKey({ id: '-1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deleteGameApiKey', async () => {
    try {
      await client.deleteGameApiKey({ id: '-1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getMatchByPlayerToken', async () => {
    try {
      await client.getMatchByPlayerToken({ playerToken: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getMatchHistory', async () => {
    try {
      await client.getMatchHistory({
        userId: '',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(404);
      expect(statusText).toBe('Not Found');
    }
  });
  it('getMatch', async () => {
    try {
      await client.getMatch({ id: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deleteMatch', async () => {
    try {
      await client.deleteMatch({ id: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postMatchJoin', async () => {
    try {
      await client.postMatchJoin({ playerToken: '' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postMatchmakingSearch', async () => {
    try {
      await client.postMatchmakingSearch({
        gameId: '1',
        matchTier: 'a',
        denominationTier: '1',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postMatchmakingCancel', async () => {
    try {
      await client.postMatchmakingCancel({ ticketId: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getMatchmakingTicket', async () => {
    try {
      await client.getMatchmakingTicket({ id: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getReplay', async () => {
    try {
      await client.getReplay({
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
      await client.postReplay({ matchId: '1', playerToken: '1', payload: 'a' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postScore', async () => {
    try {
      await client.postScore({
        id: '1',
        playerToken: '1',
        score: 1,
        finalSnapshot: false,
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postAbort', async () => {
    try {
      await client.postAbort({
        id: '1',
        playerToken: '1',
      });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getBasket', async () => {
    try {
      await client.getBasket({});
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deleteBasket', async () => {
    try {
      await client.deleteBasket({});
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('deleteBasketItem', async () => {
    try {
      await client.deleteBasketItem({ itemId: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postBasketItems', async () => {
    try {
      await client.postBasketItems({ purchasableId: '1', amount: 1 });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('patchBasketItems', async () => {
    try {
      await client.patchBasketItems({ purchasableId: '1', amount: 1 });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('postCheckoutFast', async () => {
    try {
      await client.postCheckoutFast({ purchasableId: '1' });
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getWallet', async () => {
    try {
      await client.getWallet({});
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getNotifications', async () => {
    try {
      await client.getNotifications({});
      throw Error('Should fail without credentials');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
});
