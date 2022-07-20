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

## API Key Usage

When you want to connect an application to our API you must generate an API Key first.

You can then use the client as follows:

```ts
import PlaytClient from '@playt/client';

// Create a new client with API Key and optional API URL
const client = PlaytClient('<API_KEY>', '<API_URL>');
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
