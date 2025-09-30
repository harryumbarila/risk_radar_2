import { config } from '@denali/eslint-config/base-ts';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Base configurations
  ...config,

  // Custom rules
  {
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];
