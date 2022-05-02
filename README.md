# PLAYT Client

An API client for PLAYT, written in Typescript.

## Features

- Support for client and user authentication
- Full support for all endpoints
- Fully typed request and response objects

## Usage

```sh
npm install @playt/client
```

### Client side usage

```ts
import { PlaytClient } from '@playt/client';

// Create a new client with User Credentials (client side)
// You need to authenticate with the server first to receive access and refresh tokens
const client = new PlaytClient({
  userAuth: {
    accessToken: 'XXX',
    refreshToken: 'XXX',
  },
});

// Returns current user
const { ok, data: user } = await client.getCurrentUser({});
```

### Server side usage

On server side, you have access to `/auth` routes for login, register and token refresh. This requires valid client credentials.

```ts
import { PlaytClient } from '@playt/client';

// Create a new client with Client Credentials (server side)
const client = new PlaytClient({
  clientCredentials: {
    clientId: 'API_CLIENT_ID',
    clientSecret: 'API_CLIENT_SECRET',
  },
});

// Register a new user.
// `auth` is an object with `userId`, `accessToken`, `refreshToken` and `expiresIn`
const { ok, data: auth } = await client.postRegister({
  email: 'user@playt.net',
  password: 'myAwesomePassword!!1',
  accountType: 'PLAYER',
});

// Login a user
const { ok, data: auth } = await client.postLogin({
  email: 'user@playt.net',
  password: 'myAwesomePassword!!1',
});

// Refresh an authentication token
const { ok, data: auth } = await client.postAuthRefresh({
  refreshToken: 'XXX',
});
```

## API Key Usage

When you want to connect an application to our API you must generate an API Key first.

You can then use the client as follows:

```ts
import { PlaytClient } from '@playt/client';

// Create a new client with API Key
const client = new PlaytClient({ apiKey: '<API_KEY>' });
```

## Updating props

You can update the client props at any time by calling `setProps`:

```ts
import { PlaytClient } from '@playt/client';

// Create a new client with API Key
const client = new PlaytClient({ apiKey: '<API_KEY>' });
// Update apiKey
client.setProps({ apiKey: '<NEW_API_KEY>' });
```

## API

The API is documented on [Swagger](https://playt-backend-xbwjl.ondigitalocean.app/swagger-ui/index.html) and [OpenAPI](https://playt-backend-xbwjl.ondigitalocean.app/v3/api-docs). The client is generated from the OpenAPI specification and is fully typed.
