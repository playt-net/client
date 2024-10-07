import { expect, it } from "vitest";
import { normalizeEnvironmentName } from "./utils.mjs";

it("normalizes production to something reasonable", () => {
	expect(
		normalizeEnvironmentName(new URL("https://clashparadise.io/")),
	).toMatchInlineSnapshot(`"https-clashparadise-io"`);
});

it("normalizes staging to something reasonable", () => {
	expect(
		normalizeEnvironmentName(new URL("https://staging.clashparadise.io/")),
	).toMatchInlineSnapshot(`"https-staging-clashparadise-io"`);
});

it("normalizes previews to something reasonable", () => {
	expect(
		normalizeEnvironmentName(
			new URL("https://clashparadise-git-stuff-playt.vercel.app/"),
		),
	).toMatchInlineSnapshot(`"https-clashparadise-git-stuff-playt-vercel-app"`);
});

it("normalizes development to something reasonable", () => {
	expect(
		normalizeEnvironmentName(new URL("http://localhost:4000/")),
	).toMatchInlineSnapshot(`"http-localhost-4000"`);
});
