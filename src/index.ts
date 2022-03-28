import fetcher from './fetcher';

export const getGames = fetcher.path('/game').method('get').create();
getGames({}).then((a) => {
  if (a.status === 200) {
    a.data;
  }
});
