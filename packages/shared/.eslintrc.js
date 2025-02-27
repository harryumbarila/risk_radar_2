const config = require('@denali/eslint-config/node-ts')(__dirname);

module.exports = {
  ...config,
  root: true,
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['packages/*/tsconfig.json', 'tsconfig.json'],
      },
    },
  },
};
