/** @type {import("eslint").Linter.Config} */
const config = require('@denali/eslint-config/react-ts')(__dirname);

module.exports = {
  ...config,
  root: true,
};
