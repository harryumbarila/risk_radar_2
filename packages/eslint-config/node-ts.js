const base = require('./base-ts');

/** @type {import("eslint").Linter.Config} */
module.exports = (dirname) => {
  const config = base(dirname);

  return {
    ...config,
    env: {
      node: true,
    },
    extends: [
      'eslint:recommended',
      'airbnb-base',
      'airbnb-typescript/base',
      ...config.extends,
    ],
  };
};
