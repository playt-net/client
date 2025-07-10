# PLAYT Client

An API client for the PLAYT [Clash Paradise](https://clashparadise.io/) platform, written in Typescript.

## Prerequisites

The platform requires the following assumptions about games to hold true, from most fundamental to most disposable. If your game cannot accommodate one of the latter ones, please contact us to talk about a solution.

1. Games must be fair to every player as to not constitute gambling. Any randomness/non-determinism must be seeded with the match id so that it is the same for all players.
2. Game logic must be run server-side for security reasons. We (PLAYT) do have some built-in prevention of cheats such as botting. But for sufficient baseline security, the client must only submit inputs and let the server execute logic and calculate scores, otherwise it is too easy to simply submit some score that has nothing to do with the actual player inputs made.
3. Only asynchronous non-interactive games are supported, meaning the the players' actions cannot influence each other. This is because the platform does not force players into the game after a match has been made, but gives them a certain time frame to actually join.
4. Games can recover from bad network conditions and full page reloads.
5. Games have a single-player tutorial mode.
6. Matches take no longer than a few (~3) minutes. Additionally, players may be allowed to pause the game once for a maximum of a few minutes.

## Usage

```sh
npm install @playt/client
```

### API Client

To connect your game server to our API, you must generate an API Key first.

You can then use the client as follows:

```ts
import PlaytApiClient from "@playt/client";

// Create a new client with API Key and optional API URL
const apiClient = PlaytApiClient({
  apiUrl: "<API_URL>",
  apiKey: "<API_KEY>",
});
await apiClient.initialize({
  gameVersion: "<Ideally SemVer number of your game>",
});
```

The API is documented on [Swagger](https://clashparadise.io/devs/docs) and [OpenAPI](https://clashparadise.io/api/docs). The client is generated from the OpenAPI specification and is fully typed.
The client is the easiest but not the only way to consume our API. If your game server is e.g. not written in TypeScript/JavaScript, contact us for a different solution.
Authorized endpoints are only accessible by your server-side API client using the API key, while unauthorized endpoints can also be consumed client-side, perhaps using a secret `playerToken` to identify the player.

Your game server will usually need to make at least the following calls:

```ts
// When a player connects, to retrieve or refresh the data to construct the match they are joining
const { ok, data, status, statusMessage } = await client.searchMatch({
  playerToken: "<usually from your game UI's iframe query param>",
});

// When a player increases their score or finishes or times out
const { ok, data, status, statusMessage } = await client.submitScore({
  playerToken: "<usually from your game UI's iframe query param>",
  score: 1000,
  finalSnapshot: true, // false if a player has increased their score but is still playing, true if a player finishes or times out
});
```

There is also a `submitReplay` and `getReplay` functionality that can be used to store replays and later show a ghost of the player to someone else.

### Browser Client

For a web-based game, you also need to load the browser client in the browser when the user is playing the game. It tracks user inputs for cheat detection using [Anybrain](https://anybrain.gg/), as well as capturing errors for automated tracking using [Sentry](https://sentry.io). Use the browser client as follows:

```ts
import PlaytBrowserClient from "@playt/client/browser";

// Do this as early as possible
const browserClient = PlaytBrowserClient({
  gameId: "<usually from iframe query param>",
  apiUrl: "<API_URL>",
  playerToken: "<usually from iframe query param>",
});
await browserClient.initialize({
  gameVersion: "<Ideally SemVer number of your game>",
});

// When the match starts (e.g. after a countdown), before the first user input
await browserClient.startMatch("<USER_ID>", "<MATCH_ID>");

// When the game ends (e.g. when transitioning to the end screen), after the last user input
await browserClient.stopMatch();

// When the user has nothing left to do and should be redirected away from the game
await browserClient.quitMatch();

// Optional: If you want to report a fatal error in the game, which should be sent to the platform
await browserClient.reportError("Fatal error message");
await browserClient.reportError({
  message: "Fatal error message",
  stack: "Error stack",
});

// Optional: If the player changes any settings, persist them
await browserClient.updatePlayerSettings({
  mute: true,
});
```

## Development

The API types in this repository are generated based on our [OpenAPI](https://staging.clashparadise.io/api/docs) and its corresponding types in @playt-net/clashparadise`. If the clashparadise OpenAPI changes, this project needs to be updated as well. You can do this with a few simple steps:

1. Generate new types

   ```sh
   npm run generate
   ```

   This will access all OpenAPI endpoints and generate changes based on changes to the API.

2. Check if `src/index.ts` needs to be adjusted. In case of bigger changes, for example changes to the method of an endpoint or a new endpoint, you need to update the corresponding methods.

   > ☝ You may need to update `test/fetch.test.ts` if there are significant changes to `src/index.ts`

3. Commit changes and open a PR on GitHub
4. Once changes have been approved and merged it might be time for a release
5. Create a release by running `npm version` with the correct argument to bump the repository's version
6. Push tags, generated by the previous command

   ```sh
   git push --tags
   ```

7. Create a release on GitHub

## Browser client in Webpack 4

As of the beginning of 2023, Webpack 4 is highly outdated and misses out-of-the-box support for plenty of standards such as `package.json` `exports`, `new Worker`, and `??` syntax. We suggest that you upgrade to Webpack 5. However, if you choose to continue using Webpack 4, we have found that the following workarounds (extremely hacky and likely not universal) might enable you to import the browser client in Webpack 4:

- Import `from "@playt/client/dist/browser.mjs"` instead of the usual `from "@playt/client/browser"`
- Transpile `??` if you get an error about it. This depends on your Webpack configuration, but is usually done with `babel-loader`, and there are usually good search results since this is an error that many people run into in various situations.
- Add `{ test: /\.worker\.js$/, use: { loader: "worker-loader" } }` to your Webpack config `module.rules` to be able to load workers.
- Add `"@playt/anybrain-sdk": "@playt/anybrain-sdk/webpack4/anybrain.helper.compiled.js"` to your Webpack config `resolve.alias` to load an alternative `worker-loader`-compatible version of our internal package called `@playt/anybrain-sdk`.
- If you get an error about resolving `fs`, set your Webpack config `node.fs` to `"empty"`.
