const config = require('@denali/eslint-config/nextjs-ts')(__dirname);

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...config,
  root: true,
  ignorePatterns: [
    ...config.ignorePatterns,
    'postcss.config.js',
    'tailwind.config.js',
  ],
};
