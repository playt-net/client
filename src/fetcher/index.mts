// Based on https://github.com/ajaishankar/openapi-typescript-fetch without CJS

import { Fetcher } from './fetcher.mjs';
import { arrayRequestBody } from './utils.mjs';

import type {
  ApiResponse,
  FetchArgType,
  FetchReturnType,
  FetchErrorType,
  Middleware,
  OpArgType,
  OpErrorType,
  OpDefaultReturnType,
  OpReturnType,
  TypedFetch,
} from './types.mjs';

import { ApiError } from './types.mjs';

export type {
  OpArgType,
  OpErrorType,
  OpDefaultReturnType,
  OpReturnType,
  FetchArgType,
  FetchReturnType,
  FetchErrorType,
  ApiResponse,
  Middleware,
  TypedFetch,
};

export { Fetcher, ApiError, arrayRequestBody };
