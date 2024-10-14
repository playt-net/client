import { CaptureConsole } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { ApiError, Fetcher } from "openapi-typescript-fetch";
import type { FetchConfig } from "openapi-typescript-fetch/types";
import pRetry from "p-retry";
import type { paths } from "./types.mjs";
import { normalizeEnvironmentName } from "./utils.mjs";

export type { ApiError };
export type { paths };

const PlaytApiClient = ({
	apiKey,
	apiUrl,
	retries = 5,
}: {
	apiKey: string;
	apiUrl: string;
	retries?: number;
}) => {
	// biome-ignore lint/suspicious/noExplicitAny: Any promise is fine to be extended
	const retry = <P extends Promise<any>>(p: P) => {
		return pRetry(
			async () => {
				const result = await p;
				return result;
			},
			{
				retries,
				onFailedAttempt: (error) => {
					if (error.attemptNumber > 1) {
						console.warn(
							`Fetch ${error.attemptNumber} failed with code '${error.message}'. There are ${error.retriesLeft} retries left.`,
						);
					}
				},
				shouldRetry: (error) =>
					error instanceof ApiError && error.status >= 500,
			},
		);
	};
	const fetcher = Fetcher.for<paths>();
	const config: FetchConfig = {
		baseUrl: apiUrl,
		use: [],
	};
	if (typeof apiKey !== "undefined") {
		config.init = {
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"User-Agent": `playt-client/${process.env.npm_package_version}`,
				"Content-Type": "application/json",
			},
		};
	}
	fetcher.configure(config);

	const initialize = async ({ gameVersion }: { gameVersion: string }) => {
		const sentryConfigResp = await retry(
			fetcher.path("/api/games/self/sentry-config").method("get").create()({}),
		);
		if (!sentryConfigResp.ok) {
			console.error(
				"Failed to fetch Sentry config, error tracking will not work",
			);
		}
		Sentry.init({
			...sentryConfigResp.data,
			dsn: sentryConfigResp.data.dsn ?? undefined,
			release: gameVersion,
			environment: normalizeEnvironmentName(new URL(apiUrl)),
			integrations: [
				new Sentry.Integrations.Http({ tracing: true }),
				new Sentry.Integrations.OnUncaughtException(),
				new Sentry.Integrations.OnUnhandledRejection(),
				new CaptureConsole(sentryConfigResp.data.integrations?.captureConsole),
			],
		});
	};

	const searchMatch = fetcher
		.path("/api/matches/search")
		.method("post")
		.create();
	const submitScore = fetcher
		.path("/api/matches/scores")
		.method("post")
		.create();
	const quitMatch = fetcher.path("/api/matches/quit").method("post").create();
	const submitReplay = fetcher.path("/api/replays").method("post").create();
	const getReplay = fetcher.path("/api/replays").method("get").create();

	const submitScoreWithTimestamp = ({
		timestamp = new Date().toISOString(),
		...args
	}: Parameters<typeof submitScore>[0]) => submitScore({ timestamp, ...args });

	return {
		initialize,
		fetcher,
		searchMatch: (...args: Parameters<typeof searchMatch>) =>
			retry(searchMatch(...args)),
		submitScore: (...args: Parameters<typeof submitScore>) =>
			retry(submitScore(...args)),
		/**
		 * @deprecated Use submitScore instead
		 */
		submitTutorialScore: submitScoreWithTimestamp,
		submitReplay: (...args: Parameters<typeof submitReplay>) =>
			retry(submitReplay(...args)),
		getReplay: (...args: Parameters<typeof getReplay>) =>
			retry(getReplay(...args)),
		/**
		 * @deprecated quitMatch should be called from the browser as it is faster and more reliable
		 */
		quitMatch,
	};
};
export default PlaytApiClient;
