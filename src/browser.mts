import { Fetcher } from './fetcher/fetcher.mjs';
import { FetchConfig } from './fetcher/types.mjs';
import { paths } from './types.mjs';

// This is a hack to forward console.log to the parent window.
const setupLogForwarding = (apiUrl: string) => {
  if (!window.parent) {
    console.warn('No parent window found. Not forwarding logs.');
    return;
  }
  const origin = new URL(apiUrl).origin;

  const proxiedMethods = [
    'log',
    'error',
    'info',
    'trace',
    'warn',
    'debug',
  ] as const;

  console = new Proxy(console, {
    get: function (target, prop, receiver) {
      const method = prop as typeof proxiedMethods[number];
      if (proxiedMethods.includes(method)) {
        return function (...rest: any[]) {
          // window.parent is the parent frame that made this window
          window.parent.postMessage(
            {
              source: 'iframe',
              message: {
                type: prop,
                payload: rest,
              },
            },
            origin
          );
          target[method].apply(rest);
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });
};

const PlaytBrowserClient = ({ apiUrl }: { apiUrl: string }) => {
  setupLogForwarding(apiUrl);

  const fetcher = Fetcher.for<paths>();
  const config: FetchConfig = {
    baseUrl: apiUrl,
    use: [],
  };
  fetcher.configure(config);

  async function setupAnybrain() {
    const anybrainEvent = new Promise<DocumentEventMap['anybrain']>(
      (resolve) => {
        document.addEventListener('anybrain', (event) => {
          resolve(event);
        });
      }
    );
    const anybrain = await import(`@playt/anybrain-sdk`);
    const event = await anybrainEvent;

    if (event.detail.loadModuleSuccess()) {
      return anybrain;
    } else {
      throw new Error(
        `Anybrain SDK failed to load. Error code: ${event.detail.error}`
      );
    }
  }
  const anybrainPromise = setupAnybrain();

  const startMatch = async (
    userId: string,
    matchId: string,
    playerToken: string
  ) => {
    const matchResp = await fetcher
      .path('/api/matches/{matchId}')
      .method('get')
      .create()({ matchId });
    if (!matchResp.ok) {
      throw new Error(
        `Failed to fetch match with id ${matchId}. ${matchResp.status} ${matchResp.statusText}`
      );
    }
    const { gameKey, gameSecret } = matchResp.data.game.antiCheat;
    const {
      AnybrainSetCredentials,
      AnybrainSetUserId,
      AnybrainStartMatch,
      AnybrainStartSDK,
      AnybrainSetPlayerToken,
    } = await anybrainPromise;
    AnybrainSetCredentials(gameKey, gameSecret);
    AnybrainSetUserId(userId);
    AnybrainSetPlayerToken(playerToken);
    AnybrainStartSDK();
    return AnybrainStartMatch(matchId);
  };

  const stopMatch = async () => {
    const { AnybrainStopSDK } = await anybrainPromise;
    return AnybrainStopSDK();
  };

  return { startMatch, stopMatch };
};

export default PlaytBrowserClient;
