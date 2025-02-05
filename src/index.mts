import { CaptureConsole } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { type ApiError, Fetcher } from "openapi-typescript-fetch";
import type { FetchConfig } from "openapi-typescript-fetch/types";
import type { paths } from "./types.mjs";
import { normalizeEnvironmentName } from "./utils.mjs";

export type { ApiError };
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
	const submitReplay = fetcher.path("/api/replays").method("post").create();
	const getReplay = fetcher.path("/api/replays").method("get").create();

	const submitScoreWithTimestamp = ({
		timestamp = new Date().toISOString(),
		...args
	}: Omit<Parameters<typeof submitScore>[0], "timestamp"> & {
		timestamp?: string;
	}) => submitScore({ timestamp, ...args });

	const submitAchievements = (payload: {
		achievements: `achievement-${number}`[];
		playerToken: string;
	}) =>
		fetcher.path("/api/matches/achievements").method("post").create()(payload);

	return {
		initialize,
		fetcher,
		searchMatch,
		submitScore: submitScoreWithTimestamp,
		submitAchievements,
		submitReplay,
		getReplay,
	};
};
export default PlaytApiClient;
