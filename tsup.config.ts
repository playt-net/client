import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.mts", "src/browser.mts"],
	splitting: false,
	sourcemap: true,
	clean: true,
	define: {
		"process.env.npm_package_version": `"${process.env.npm_package_version ?? "unknown"}"`,
	},
	dts: true,
	format: ["esm", "cjs"],
});
