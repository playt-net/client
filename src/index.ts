import { ApiError, Fetcher } from './fetcher/index.js';

import type { paths } from './types.js';
import Pusher from 'pusher-js';
import type { FetchConfig } from './fetcher/types.js';

export { ApiError };

export const PlaytServer = function ({
  apiKey,
  apiUrl,
}: {
  apiKey?: string;
  apiUrl?: string;
} = {}) {
  const fetcher = Fetcher.for<paths>();
  const config: FetchConfig = {
    baseUrl: apiUrl ?? 'https://fun-fair.vercel.app',
    use: [],
  };
  if (typeof apiKey !== 'undefined') {
    config.init = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
    };
  }
  fetcher.configure(config);

  const getLiveMatchChannel = fetcher
    .path('/api/live/channels')
    .method('get')
    .create();
  const searchMatch = fetcher
    .path('/api/matches/search')
    .method('post')
    .create();
  const submitScore = fetcher
    .path('/api/matches/scores')
    .method('post')
    .create();
  const quitMatch = fetcher.path('/api/matches/quit').method('post').create();
  const submitTutorialScore = fetcher
    .path('/api/tutorials/scores')
    .method('post')
    .create();
  const submitReplay = fetcher.path('/api/replays').method('post').create();
  const getReplay = fetcher.path('/api/replays').method('get').create();

  const subscribeLiveMatch = async (
    playerToken: string,
    onUpdate: (data: any) => void
  ) => {
    const { data: liveChannel } = await getLiveMatchChannel({ playerToken });
    const pusher = new Pusher(liveChannel.appKey, {
      cluster: 'eu',
      channelAuthorization: {
        transport: 'ajax',
        endpoint: `${apiUrl}/api/live/auth`,
        params: { playerToken },
      },
    });
    const channel = pusher.subscribe(liveChannel.channelName);

    channel.bind('client-update', (data: any) => {
      onUpdate(data);
    });

    return {
      send: (payload: any) => {
        channel.trigger('client-update', payload);
      },
    };
  };

  return {
    fetcher,
    searchMatch,
    submitScore,
    submitTutorialScore,
    submitReplay,
    getReplay,
    quitMatch,
    subscribeLiveMatch,
    getLiveMatchChannel,
  };
};

export const PlaytClient = ({
  apiUrl,
  gameId,
  gameKey,
}: {
  apiUrl: string;
  gameId: string;
  gameKey: string;
}) => {
  async function setupAnybrain() {
    import(
      /* webpackIgnore: true */
      `${apiUrl}/AnybrainSDK/anybrain.helper.js`
    );
    return new Promise<void>((resolve, reject) => {
      document.addEventListener('anybrain', (event) => {
        // @ts-expect-error
        if (event.detail.loadModuleSuccess()) {
          // @ts-expect-error
          AnybrainSetCredentials(gameId, gameKey);

          resolve();
        }
        // @ts-expect-error
        if (event.detail.error != 0) {
          reject();
        }
      });
    });
  }
  const anybrain = setupAnybrain();

  const startMatch = async (playerToken: string) => {
    await anybrain;
    // @ts-expect-error
    AnybrainSetUserId(playerToken);
    // @ts-expect-error
    AnybrainStartSDK();
    // @ts-expect-error
    return AnybrainStartMatch(playerToken);
  };

  const stopMatch = async () => {
    await anybrain;
    // @ts-expect-error
    AnybrainStopMatch();
    // @ts-expect-error
    return AnybrainStopSDK();
  };
  return { startMatch, stopMatch };
};
