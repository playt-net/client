import "./fetch-polyfill.mjs";
import { describe, expect, it, vi } from "vitest";

import PlaytApiClient from "../index.mjs";

const client = PlaytApiClient({
	apiKey: "INVALID",
	apiUrl: "https://staging.clashparadise.io",
	retries: 1,
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
describe("fetch", () => {
	it("searchMatch", async () => {
		const promise = searchMatch({
			playerToken: "unknown",
		});
		await expect(promise).rejects.toThrowError(
			expect.objectContaining({
				status: 401,
				statusText: "Unauthorized",
			}),
		);
	});
	it("quitMatch", async () => {
		const promise = quitMatch({
			playerToken: "unknown",
		});
		await expect(promise).rejects.toThrowError(
			expect.objectContaining({
				status: 401,
				statusText: "Unauthorized",
			}),
		);
	});
	it("submitScore", async () => {
		const promise = submitScore({
			playerToken: "unknown",
			score: 1000,
			finalSnapshot: true,
		});
		await expect(promise).rejects.toThrowError(
			expect.objectContaining({
				status: 401,
				statusText: "Unauthorized",
			}),
		);
	});
	it("submitTutorialScore", async () => {
		const promise = submitTutorialScore({
			playerToken: "unknown",
			score: 1000,
			finalSnapshot: true,
		});
		await expect(promise).rejects.toThrowError(
			expect.objectContaining({
				status: 401,
				statusText: "Unauthorized",
			}),
		);
	});
	it("submitReplay", async () => {
		const promise = submitReplay({
			playerToken: "unknown",
			payload: JSON.stringify([]),
		});
		await expect(promise).rejects.toThrowError(
			expect.objectContaining({
				status: 401,
				statusText: "Unauthorized",
			}),
		);
	});
	it("getReplay", async () => {
		const promise = getReplay({
			userId: "65494b94b516f1c169d033ea",
			matchId: "65494b94b516f1c169d033ea",
		});
		await expect(promise).rejects.toThrowError(
			expect.objectContaining({
				status: 404,
				statusText: "Not Found",
			}),
		);
	});
});
