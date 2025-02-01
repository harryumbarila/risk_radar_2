const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = (dirname) => {
  const config = require('./base');

  return {
    ...config,
    extends: [
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:import/typescript',
      ...config.extends,
    ],
    plugins: [...config.plugins, '@typescript-eslint'],
    parserOptions: {
      tsconfigRootDir: dirname,
      project: ['./tsconfig.json'],
    },
    settings: {
      ...config.settings,
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.mts', '.cts', '.tsx', '.d.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [path.resolve(dirname, 'tsconfig.json')],
        },
      },
    },
    rules: {
      ...config.rules,
      // this rule conflicts with typescript
      'no-use-before-define': 'off',

      // typescript
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
    },
    ignorePatterns: [
      ...config.ignorePatterns,
      '**/*.js',
      '**/*.json',
      'node_modules',
      'public',
      'styles',
      'coverage',
      'dist',
      '.turbo',
    ],
  };
};
