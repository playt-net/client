import Pusher from 'pusher-js';
import { Fetcher } from './fetcher/fetcher.mjs';
import { FetchConfig } from './fetcher/types.mjs';
import { paths } from './types.mjs';

const PlaytBrowserClient = ({
  // TODO move pusher stuff in here
  apiUrl,
  gameId,
  gameKey,
}: {
  apiUrl?: string;
  gameId: string;
  gameKey: string;
}) => {
  const fetcher = Fetcher.for<paths>();
  const config: FetchConfig = {
    baseUrl: apiUrl ?? 'https://fun-fair.vercel.app',
    use: [],
  };
  fetcher.configure(config);

  const getLiveMatchChannel = fetcher
    .path('/api/live/channels')
    .method('get')
    .create();

  async function setupAnybrain() {
    const anybrainEvent = new Promise((resolve) => {
      document.addEventListener('anybrain', (event) => {
        resolve(event);
      });
    });
    // @ts-expect-error TODO
    await import(`../external/AnybrainSDK/anybrain.helper.js`);
    const event = await anybrainEvent;

    // @ts-expect-error TODO
    if (event.detail.loadModuleSuccess()) {
      AnybrainSetCredentials(gameId, gameKey);
    }
    throw new Error(
      // @ts-expect-error TODO
      `Anybrain SDK failed to load. Error code: ${event.detail.error}`
    );
  }
  const anybrain = setupAnybrain();

  const startMatch = async (playerToken: string) => {
    await anybrain;
    AnybrainSetUserId(playerToken);
    AnybrainStartSDK();
    return AnybrainStartMatch(playerToken);
  };

  const stopMatch = async () => {
    await anybrain;
    AnybrainStopMatch();
    return AnybrainStopSDK();
  };

  const subscribeLiveMatch = async (
    playerToken: string,
    onUpdate: (data: any) => void
  ) => {
    const { data: liveChannel } = await getLiveMatchChannel({ playerToken });
    const pusher = new Pusher.default(liveChannel.appKey, {
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
  return { startMatch, stopMatch, subscribeLiveMatch, getLiveMatchChannel };
};

export default PlaytBrowserClient;
