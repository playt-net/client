import fetcher from './fetcher';

export const postRegister = fetcher
  .path('/auth/register')
  .method('post')
  .create();
export const postAuthRefresh = fetcher
  .path('/auth/refresh')
  .method('post')
  .create();
export const postLogin = fetcher.path('/auth/login').method('post').create();

export const getCurrentUser = fetcher.path('/user').method('get').create();
export const putCurrentUser = fetcher.path('/user').method('put').create();
export const patchCurrentUser = fetcher.path('/user').method('patch').create();
export const getUser = fetcher.path('/user/{id}').method('get').create();

export const getTutorials = fetcher.path('/tutorial').method('get').create();
export const postTutorial = fetcher.path('/tutorial').method('post').create();
export const getTutorial = fetcher
  .path('/tutorial/{id}')
  .method('get')
  .create();
export const putTutorial = fetcher
  .path('/tutorial/{id}')
  .method('put')
  .create();

export const getPurchasables = fetcher
  .path('/purchasable')
  .method('get')
  .create();
export const postPurchasable = fetcher
  .path('/purchasable')
  .method('post')
  .create();
export const getPurchasable = fetcher
  .path('/purchasable/{id}')
  .method('get')
  .create();
export const putPurchasable = fetcher
  .path('/purchasable/{id}')
  .method('put')
  .create();
export const deletePurchasable = fetcher
  .path('/purchasable/{id}')
  .method('delete')
  .create();

export const getGames = fetcher.path('/game').method('get').create();
export const postGame = fetcher.path('/game').method('post').create();
export const getGame = fetcher.path('/game/{id}').method('get').create();
export const putGame = fetcher.path('/game/{id}').method('put').create();
export const deleteGame = fetcher.path('/game/{id}').method('delete').create();
export const putGameApiKey = fetcher
  .path('/game/{id}/api-key')
  .method('put')
  .create();
export const deleteGameApiKey = fetcher
  .path('/game/{id}/api-key')
  .method('delete')
  .create();

export const getMatches = fetcher.path('/match').method('get').create();
export const getMatch = fetcher.path('/match/{id}').method('get').create();
export const deleteMatch = fetcher
  .path('/match/{id}')
  .method('delete')
  .create();
export const postMatchJoin = fetcher
  .path('/match/join')
  .method('post')
  .create();
export const getReplay = fetcher
  .path('/match/{matchId}/replay/{userId}')
  .method('get')
  .create();
export const postReplay = fetcher
  .path('/match/{matchId}/replay/{userId}')
  .method('post')
  .create();
export const postScore = fetcher
  .path('/match/{id}/score')
  .method('post')
  .create();

export const getBasket = fetcher.path('/basket').method('get').create();
export const deleteBasket = fetcher.path('/basket').method('delete').create();
export const postBasketItems = fetcher
  .path('/basket/items')
  .method('post')
  .create();
export const patchBasketItems = fetcher
  .path('/basket/items')
  .method('patch')
  .create();

export const postCheckoutFast = fetcher
  .path('/checkout/fast')
  .method('post')
  .create();

export const getWallet = fetcher.path('/wallet').method('get').create();
