import './fetch-polyfill';

import PlaytClient, { ApiError } from '../index.mjs';
import { describe, it, expect } from 'vitest';

// TODO fix test

const client = PlaytClient({
  apiKey: 'INVALID',
  apiUrl: 'https://fun-fair.vercel.app',
});
const {
  searchMatch,
  quitMatch,
  submitScore,
  submitTutorialScore,
  submitReplay,
  getReplay,
} = client;

/**
 * These tests should not replace backend tests, but make sure that the services are available.
 */
describe('fetch', () => {
  it('searchMatch', async () => {
    try {
      await searchMatch({
        playerToken: 'unknown',
      });
      throw Error('Should fail without valid query');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(404);
      expect(statusText).toBe('Not Found');
    }
  });
  it('quitMatch', async () => {
    try {
      await quitMatch({
        playerToken: 'unknown',
      });
      throw Error('Should fail without valid query');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('submitScore', async () => {
    try {
      await submitScore({
        playerToken: 'unknown',
        score: 1000,
        finalSnapshot: true,
      });
      throw Error('Should fail without valid query');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('submitTutorialScore', async () => {
    try {
      await submitTutorialScore({
        playerToken: 'unknown',
        score: 1000,
        finalSnapshot: true,
      });
      throw Error('Should fail without valid query');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(404);
      expect(statusText).toBe('Not Found');
    }
  });
  it('submitReplay', async () => {
    try {
      await submitReplay({
        playerToken: 'unknown',
        payload: JSON.stringify([]),
      });
      throw Error('Should fail without valid query');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(401);
      expect(statusText).toBe('Unauthorized');
    }
  });
  it('getReplay', async () => {
    try {
      await getReplay({
        userId: 'unknown',
        matchId: 'unknown',
      });
      throw Error('Should fail without valid query');
    } catch (error) {
      const { status, statusText } = error as ApiError;
      expect(status).toBe(404);
      expect(statusText).toBe('Not Found');
    }
  });
});