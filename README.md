# PLAYT Client

An API client for PLAYT, written in Typescript.

## Features

- Support authentication
- Full support for all endpoints
- Fully typed request and response objects

## Usage

```sh
npm install @playt/client
```

### API Client

When you want to connect an application to our API you must generate an API Key first.

You can then use the client as follows:

```js
import PlaytApiClient from '@playt/client';

// Create a new client with API Key and optional API URL
const apiClient = PlaytApiClient({
  apiUrl: '<API_URL>',
  apiKey: '<API_KEY>',
});
```

### Browser Client

For a web-based game, you also need to load the browser client in the browser when the user is playing the game. Among other optional features, it tracks user inputs for cheat detection using [Anybrain](https://anybrain.gg/). Use the browser client as follows:

```js
import PlaytBrowserClient from '@playt/client/browser';

const browserClient = PlaytBrowserClient({
  apiUrl: '<API_URL>',
});

// When the game starts
await browserClient.startMatch('<USER_ID>', '<MATCH_ID>', '<PLAYER_TOKEN>');

// When the game ends
await browserClient.stopMatch();
```

## API

The API is documented on [Swagger](https://fun-fair.vercel.app/devs/docs) and [OpenAPI](https://fun-fair.vercel.app/api/docs). The client is generated from the OpenAPI specification and is fully typed.

Example

```ts
// Submits a score
const { ok, data, status, statusMessage } = await client.submitScore({
  playerToken: 'PLAYER_TOKEN',
  score: 1000,
  finalSnapshot: true,
});
```

## Development

The API types in this repository are generated based on our [OpenAPI](https://staging.clashparadise.io/api/docs) and its corresponding types in @playt-net/clashparadise`. If the fun-fair OpenAPI changes, this project needs to be updated as well. You can do this with a few simple steps:

1. Generate new types

```sh
npm run generate
```

This will access all OpenAPI endpoints and generate changes based on changes to the API.

1. Check if `src/index.ts` needs to be adjusted. In case of bigger changes, for example changes to the method of an endpoint or a new endpoint, you need to update the corresponding methods.

   > ☝ You may need to update `test/fetch.test.ts` if there are significant changes to `src/index.ts`

2. Commit changes and open a PR on GitHub
3. Once changes have been approved and merged it might be time for a release
4. Create a release by running `npm version` with the correct argument to bump the repsitory's version
5. Push tags, generated by the previous command

    ```sh
    git push --tags
    ```

6. Create a release on GitHub

## Browser client in Webpack 4

As of the beginning of 2023, Webpack 4 is highly outdated and misses out-of-the-box support for plenty of standards such as `package.json` `exports`, `new Worker`, and `??` syntax. We suggest that you upgrade to Webpack 5. However, if you choose to continue using Webpack 4, we have found that the following workarounds (extremely hacky and likely not universal) might enable you to import the browser client in Webpack 4:

- Import `from "@playt/client/dist/browser.mjs"` instead of the usual `from "@playt/client/browser"`
- Transpile `??` if you get an error about it. This depends on your Webpack configuration, but is usually done with `babel-loader`, and there are usually good search results since this is an error that many people run into in various situations.
- Add `{ test: /\.worker\.js$/, use: { loader: "worker-loader" } }` to your Webpack config `module.rules` to be able to load workers.
- Add `"@playt/anybrain-sdk": "@playt/anybrain-sdk/webpack4/anybrain.helper.compiled.js"` to your Webpack config `resolve.alias` to load an alternative `worker-loader`-compatible version of our internal package called `@playt/anybrain-sdk`.
- If you get an error about resolving `fs`, set your Webpack config `node.fs` to `"empty"`.
