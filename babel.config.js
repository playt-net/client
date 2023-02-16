module.exports = {
  presets: ['@babel/preset-typescript'],
  env: {
    test: {
      presets: ['@babel/preset-env'],
    },
  },
};
