module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: ['transform-inline-environment-variables'],
  env: {
    test: {
      presets: ['@babel/preset-env'],
    },
  },
};
