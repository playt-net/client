import { ApiError, Fetcher } from "./fetcher/index.mjs";

import { CaptureConsole } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import type { FetchConfig } from "./fetcher/types.mjs";
import type { paths } from "./types.mjs";
import { normalizeEnvironmentName } from "./utils.mjs";

export { ApiError };
export type { paths };

const PlaytApiClient = ({
	apiKey,
	apiUrl,
}: {
	apiKey: string;
	apiUrl: string;
}) => {
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
		const sentryConfigResp = await fetcher
			.path("/api/games/self/sentry-config")
			.method("get")
			.create()({});
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
		searchMatch,
		submitScore: submitScoreWithTimestamp,
		/**
		 * @deprecated Use submitScore instead
		 */
		submitTutorialScore: submitScoreWithTimestamp,
		submitReplay,
		getReplay,
		quitMatch,
	};
};
export default PlaytApiClient;
