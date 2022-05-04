import type {
  ApiResponse,
  Middleware,
  ApiError as ApiErrorType,
} from 'openapi-typescript-fetch';
import { ApiError, Fetcher } from 'openapi-typescript-fetch';

import type { paths, components, operations } from './types';
export type { paths, components, operations, ApiResponse };

export { ApiError };

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
  apiKey?: string;
  apiHost?: string;
};

export class PlaytClient {
  clientCredentials?: ClientCredentials;
  userAuth?: UserAuth;
  onRequestRefresh?: () => Promise<UserAuth | null>;
  apiKey?: string;
  apiHost?: string;
  fetcher = Fetcher.for<paths>();

  constructor(props: PLAYTClientProps) {
    this.setProps(props);
  }

  setProps({
    clientCredentials,
    userAuth,
    onRequestRefresh,
    apiKey,
    apiHost = 'https://playt-backend-xbwjl.ondigitalocean.app',
  }: PLAYTClientProps) {
    this.clientCredentials = clientCredentials;
    this.userAuth = userAuth;
    this.onRequestRefresh = onRequestRefresh;
    this.apiKey = apiKey;
    this.apiHost = apiHost;

    this.fetcher.configure({
      baseUrl: this.apiHost,
      init: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      use: [this.authenticate],
    });
  }

  authenticate: Middleware = async (url, init, next) => {
    try {
      if (this.clientCredentials && url.includes('/auth/')) {
        init.headers.set(
          'Authorization',
          `Basic ${Buffer.from(
            `${this.clientCredentials.clientId}:${this.clientCredentials.clientSecret}`
          ).toString('base64')}`
        );
      } else if (this.userAuth?.accessToken) {
        init.headers.set(
          'Authorization',
          `Bearer ${this.userAuth.accessToken}`
        );
      } else if (this.apiKey) {
        init.headers.set('X-Api-Key', this.apiKey);
      }
      const response = await next(url, init);
      return response;
    } catch (error) {
      const { status } = error as ApiErrorType;

      if (
        status === 401 &&
        this.userAuth?.refreshToken &&
        this.onRequestRefresh
      ) {
        const refreshedUserAuth = await this.onRequestRefresh();
        if (refreshedUserAuth) {
          this.userAuth.accessToken = refreshedUserAuth.accessToken;
          this.userAuth.refreshToken = refreshedUserAuth.refreshToken;
          init.headers.set(
            'Authorization',
            `Bearer ${this.userAuth.accessToken}`
          );
          const response = await next(url, init);
          return response;
        }
      }
      throw error;
    }
  };

  postRegister = this.fetcher.path('/auth/register').method('post').create();
  postAuthRefresh = this.fetcher.path('/auth/refresh').method('post').create();
  postLogin = this.fetcher.path('/auth/login').method('post').create();

  getCurrentUser = this.fetcher.path('/user').method('get').create();
  putCurrentUser = this.fetcher.path('/user').method('put').create();
  patchCurrentUser = this.fetcher.path('/user').method('patch').create();
  getUser = this.fetcher.path('/user/{id}').method('get').create();

  getTutorials = this.fetcher.path('/tutorial').method('get').create();
  postTutorial = this.fetcher.path('/tutorial').method('post').create();
  getTutorial = this.fetcher.path('/tutorial/{id}').method('get').create();
  putTutorial = this.fetcher.path('/tutorial/{id}').method('put').create();

  getPurchasables = this.fetcher.path('/purchasable').method('get').create();
  postPurchasable = this.fetcher.path('/purchasable').method('post').create();
  getPurchasable = this.fetcher
    .path('/purchasable/{id}')
    .method('get')
    .create();
  putPurchasable = this.fetcher
    .path('/purchasable/{id}')
    .method('put')
    .create();
  deletePurchasable = this.fetcher
    .path('/purchasable/{id}')
    .method('delete')
    .create();

  getGames = this.fetcher.path('/game').method('get').create();
  postGame = this.fetcher.path('/game').method('post').create();
  getGame = this.fetcher.path('/game/{id}').method('get').create();
  putGame = this.fetcher.path('/game/{id}').method('put').create();
  deleteGame = this.fetcher.path('/game/{id}').method('delete').create();
  putGameApiKey = this.fetcher
    .path('/game/{id}/api-key')
    .method('put')
    .create();
  deleteGameApiKey = this.fetcher
    .path('/game/{id}/api-key')
    .method('delete')
    .create();

  getMatchByPlayerToken = this.fetcher
    .path('/match/playerToken/{playerToken}')
    .method('get')
    .create();
  getMatchHistory = this.fetcher
    .path('/match/history/user/{userId}')
    .method('get')
    .create();
  getMatch = this.fetcher.path('/match/{id}').method('get').create();
  deleteMatch = this.fetcher.path('/match/{id}').method('delete').create();
  postMatchJoin = this.fetcher.path('/match/join').method('post').create();
  getReplay = this.fetcher
    .path('/match/{matchId}/replay/{userId}')
    .method('get')
    .create();
  postReplay = this.fetcher
    .path('/match/{matchId}/replay/{playerToken}')
    .method('post')
    .create();
  postScore = this.fetcher.path('/match/{id}/score').method('post').create();
  postAbort = this.fetcher.path('/match/{id}/abort').method('post').create();

  postMatchmakingSearch = this.fetcher
    .path('/matchmaking/search')
    .method('post')
    .create();
  postMatchmakingCancel = this.fetcher
    .path('/matchmaking/cancel')
    .method('post')
    .create();
  getMatchmakingTicket = this.fetcher
    .path('/matchmaking/ticket/{id}')
    .method('get')
    .create();

  getBasket = this.fetcher.path('/basket').method('get').create();
  deleteBasketItem = this.fetcher
    .path('/basket/items/{itemId}')
    .method('delete')
    .create();
  deleteBasket = this.fetcher.path('/basket').method('delete').create();
  postBasketItems = this.fetcher.path('/basket/items').method('post').create();
  patchBasketItems = this.fetcher
    .path('/basket/items')
    .method('patch')
    .create();

  postCheckoutFast = this.fetcher
    .path('/checkout/fast')
    .method('post')
    .create();

  getWallet = this.fetcher.path('/wallet').method('get').create();

  getNotifications = this.fetcher.path('/notification').method('get').create();

  getUserWinRatio = this.fetcher
    .path('/stats/user/{userId}/aggregate/winRatio')
    .method('get')
    .create();
}
