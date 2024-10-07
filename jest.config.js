module.exports = {
	moduleFileExtensions: ["js", "mjs", "ts", "mts"],
	moduleNameMapper: {
		"(.*)\\.mjs$": "$1.mts",
	},
	transform: {
		"\\.(js|mjs|ts|mts)$": "babel-jest",
	},
	transformIgnorePatterns: [
		"node_modules/(?!(fetch-blob|node-fetch|data-uri-to-buffer|formdata-polyfill)/)",
	],
	testMatch: ["**/*.test.mts"],
};
