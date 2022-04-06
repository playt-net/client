import { ApiError, Fetcher, Middleware } from 'openapi-typescript-fetch';
import type { paths, components, operations } from './types';
export type { paths, components, operations };

export type ClientCredentials = {
  clientId: string;
  clientSecret: string;
};
export type UserAuth = {
  accessToken?: string;
  refreshToken?: string;
};
export type PLAYTClientProps = {
  clientCredentials?: ClientCredentials;
  userAuth?: UserAuth;
  onRequestRefresh?: () => Promise<UserAuth | null>;
  apiHost?: string;
};
export const PlaytClient = ({
  clientCredentials,
  userAuth,
  onRequestRefresh,
  apiHost = 'https://playt-backend-xbwjl.ondigitalocean.app',
}: PLAYTClientProps) => {
  const fetcher = Fetcher.for<paths>();

  const authenticate: Middleware = async (url, init, next) => {
    try {
      if (clientCredentials && url.includes('/auth/')) {
        init.headers.set(
          'Authorization',
          `Basic ${Buffer.from(
            `${clientCredentials.clientId}:${clientCredentials.clientSecret}`
          ).toString('base64')}`
        );
      } else if (userAuth?.accessToken) {
        init.headers.set('Authorization', `Bearer ${userAuth.accessToken}`);
      }
      const response = await next(url, init);
      return response;
    } catch (error) {
      const { status } = error as ApiError;

      if (status === 401 && userAuth?.refreshToken && onRequestRefresh) {
        const refreshedUserAuth = await onRequestRefresh();
        if (refreshedUserAuth) {
          userAuth.accessToken = refreshedUserAuth.accessToken;
          userAuth.refreshToken = refreshedUserAuth.refreshToken;
          init.headers.set('Authorization', `Bearer ${userAuth.accessToken}`);
          const response = await next(url, init);
          return response;
        }
      }
      throw error;
    }
  };

  fetcher.configure({
    baseUrl: apiHost,
    init: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    use: [authenticate],
  });

  const postRegister = fetcher.path('/auth/register').method('post').create();
  const postAuthRefresh = fetcher.path('/auth/refresh').method('post').create();
  const postLogin = fetcher.path('/auth/login').method('post').create();

  const getCurrentUser = fetcher.path('/user').method('get').create();
  const putCurrentUser = fetcher.path('/user').method('put').create();
  const patchCurrentUser = fetcher.path('/user').method('patch').create();
  const getUser = fetcher.path('/user/{id}').method('get').create();

  const getTutorials = fetcher.path('/tutorial').method('get').create();
  const postTutorial = fetcher.path('/tutorial').method('post').create();
  const getTutorial = fetcher.path('/tutorial/{id}').method('get').create();
  const putTutorial = fetcher.path('/tutorial/{id}').method('put').create();

  const getPurchasables = fetcher.path('/purchasable').method('get').create();
  const postPurchasable = fetcher.path('/purchasable').method('post').create();
  const getPurchasable = fetcher
    .path('/purchasable/{id}')
    .method('get')
    .create();
  const putPurchasable = fetcher
    .path('/purchasable/{id}')
    .method('put')
    .create();
  const deletePurchasable = fetcher
    .path('/purchasable/{id}')
    .method('delete')
    .create();

  const getGames = fetcher.path('/game').method('get').create();
  const postGame = fetcher.path('/game').method('post').create();
  const getGame = fetcher.path('/game/{id}').method('get').create();
  const putGame = fetcher.path('/game/{id}').method('put').create();
  const deleteGame = fetcher.path('/game/{id}').method('delete').create();
  const putGameApiKey = fetcher
    .path('/game/{id}/api-key')
    .method('put')
    .create();
  const deleteGameApiKey = fetcher
    .path('/game/{id}/api-key')
    .method('delete')
    .create();

  const getMatches = fetcher.path('/match').method('get').create();
  const getMatch = fetcher.path('/match/{id}').method('get').create();
  const deleteMatch = fetcher.path('/match/{id}').method('delete').create();
  const postMatchJoin = fetcher.path('/match/join').method('post').create();
  const getReplay = fetcher
    .path('/match/{matchId}/replay/{userId}')
    .method('get')
    .create();
  const postReplay = fetcher
    .path('/match/{matchId}/replay/{userId}')
    .method('post')
    .create();
  const postScore = fetcher.path('/match/{id}/score').method('post').create();

  const postMatchmakingSearch = fetcher
    .path('/matchmaking/search')
    .method('post')
    .create();
  const postMatchmakingCancel = fetcher
    .path('/matchmaking/cancel')
    .method('post')
    .create();
  const getMatchmakingTicket = fetcher
    .path('/matchmaking/ticket/{id}')
    .method('get')
    .create();

  const getBasket = fetcher.path('/basket').method('get').create();
  const deleteBasketItem = fetcher
    .path('/basket/items/{itemId}')
    .method('delete')
    .create();
  const deleteBasket = fetcher.path('/basket').method('delete').create();
  const postBasketItems = fetcher.path('/basket/items').method('post').create();
  const patchBasketItems = fetcher
    .path('/basket/items')
    .method('patch')
    .create();

  const postCheckoutFast = fetcher
    .path('/checkout/fast')
    .method('post')
    .create();

  const getWallet = fetcher.path('/wallet').method('get').create();

  const getNotifications = fetcher.path('/notification').method('get').create();

  return {
    deleteBasket,
    deleteBasketItem,
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
    getMatchmakingTicket,
    getNotifications,
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
    postMatchmakingCancel,
    postMatchmakingSearch,
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
  };
};
