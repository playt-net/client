import fetcher from './fetcher';

export const getGames = fetcher.path('/game').method('get').create();
