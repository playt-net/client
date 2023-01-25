import type { Configuration } from 'webpack';
import { resolve } from 'path';

const config: Configuration = {
  mode: 'production',
  entry: {
    index: './src/index.mts',
    browser: './src/browser.mts',
  },
  resolve: {
    extensions: ['.mts', '.mjs'],
    extensionAlias: {
      '.mjs': ['.mts', '.mjs'],
    },
  },
  module: {
    rules: [
      {
        test: /\.mts$/,
        use: 'babel-loader',
      },
    ],
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].mjs',
    libraryTarget: 'module',
    globalObject: 'globalThis',
  },
  experiments: {
    outputModule: true,
  },
};
export default config;
