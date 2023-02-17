module.exports = {
  moduleFileExtensions: ['js', 'mjs', 'ts', 'mts'],
  moduleNameMapper: {
    '(.*)\\.mjs$': '$1.mts',
  },
  transform: {
    '\\.(js|mjs|ts|mts)$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  testMatch: ['**/*.test.mts'],
};
