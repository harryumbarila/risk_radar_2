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

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'react-table-config.d.ts',
      '.lintstagedrc.cjs',
    ],
  },
];
