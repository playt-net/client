import * as Sentry from "@sentry/browser";
import { CaptureConsole } from "@sentry/integrations";
import { Fetcher } from "openapi-typescript-fetch";
import type { FetchConfig } from "openapi-typescript-fetch/types";
import type { operations, paths } from "./types.mjs";
import { normalizeEnvironmentName } from "./utils.mjs";

const PLAYT_CLIENT_ID = `playt-browser-client/${process.env.npm_package_version}`;

const PlaytBrowserClient = ({
	gameId,
	apiUrl,
	playerToken,
}: {
	gameId: string;
	apiUrl: string;
	playerToken: string;
}) => {
	let baseUrl: string;
	try {
		const url = new URL(apiUrl);
		baseUrl = url.origin;
	} catch (e: unknown) {
		throw new Error(`Invalid API URL: ${apiUrl}`);
	}

	const fetcher = Fetcher.for<paths>();
	const config: FetchConfig = {
		baseUrl,
		use: [],
		init: {
			headers: {
				"User-Agent": PLAYT_CLIENT_ID,
			},
		},
	};
	fetcher.configure(config);

	const initialize = async ({ gameVersion }: { gameVersion: string }) => {
		const sentryConfigResp = await fetcher
			.path("/api/games/{gameId}/sentry-config")
			.method("get")
			.create()({ gameId });
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
				new Sentry.BrowserTracing(),
				new CaptureConsole(sentryConfigResp.data.integrations?.captureConsole),
			],
		});
	};

	const setupAnybrain = async () => {
		const anybrainEvent = new Promise<DocumentEventMap["anybrain"]>(
			(resolve) => {
				document.addEventListener("anybrain", (event) => {
					resolve(event);
				});
			},
		);
		const anybrain = await import("@playt/anybrain-sdk");
		const event = await anybrainEvent;

		if (event.detail.loadModuleSuccess()) {
			return anybrain;
		}

		throw new Error(
			`Anybrain SDK failed to load. Error code: ${event.detail.error}`,
		);
	};
	const anybrainPromise = setupAnybrain();

	const startMatch = async (userId: string, matchId: string) => {
		const antiCheatConfigResp = await fetcher
			.path("/api/games/{gameId}/anti-cheat-config")
			.method("get")
			.create()({ gameId });
		if (!antiCheatConfigResp.ok) {
			throw new Error("Failed to fetch anti-cheat config");
		}
		const { gameKey, gameSecret } = antiCheatConfigResp.data;
		const {
			AnybrainSetCredentials,
			AnybrainSetUserId,
			AnybrainStartMatch,
			AnybrainStartSDK,
			AnybrainSetPlayerToken,
		} = await anybrainPromise;
		AnybrainSetCredentials(gameKey, gameSecret);
		AnybrainSetUserId(userId);
		AnybrainSetPlayerToken(playerToken);
		AnybrainStartSDK();
		return AnybrainStartMatch(matchId);
	};

	const stopMatch = async () => {
		const { AnybrainStopSDK } = await anybrainPromise;
		return AnybrainStopSDK();
	};

	const reportFatalError = (error: unknown) => {
		window.parent.postMessage(
			{ PLAYT_CLIENT_ID, type: "error", error },
			baseUrl,
		);
		console.warn("Reporting error:", error);
	};

	const updatePlayerSettings = async (
		userSettings: Omit<
			operations["updateSettings"]["requestBody"]["content"]["application/json"],
			"playerToken"
		>,
	) => {
		await fetcher.path("/api/user/settings").method("post").create()({
			playerToken,
			...userSettings,
		});
	};

	const quitMatch = async () => {
		const quitPromise = fetcher
			.path("/api/matches/quit")
			.method("post")
			.create()({
			playerToken,
		});
		void window.parent.postMessage({ PLAYT_CLIENT_ID, type: "quit" }, baseUrl);
		await quitPromise;
	};

	const getAvatar = async () => {
		const result = await fetcher
			.path("/api/avatar/{playerToken}")
			.method("get")
			.create()({
			playerToken,
		});
		return result.data;
	};

	return {
		initialize,
		startMatch,
		stopMatch,
		reportFatalError,
		updatePlayerSettings,
		quitMatch,
		getAvatar,
	};
};

export default PlaytBrowserClient;
