const PlaytBrowserClient = ({
  // TODO move pusher stuff in here
  gameId,
  gameKey,
}: {
  gameId: string;
  gameKey: string;
}) => {
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
  return { startMatch, stopMatch };
};

export default PlaytBrowserClient;
