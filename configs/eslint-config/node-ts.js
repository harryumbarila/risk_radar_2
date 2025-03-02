module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    require.resolve('./base-ts'),
  ],
};
