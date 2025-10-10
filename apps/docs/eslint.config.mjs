import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  // Next.js core config
  ...compat.extends('next/core-web-vitals'),

  // React configuration
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      'react/no-unstable-nested-components': 'error',
      'react/no-array-index-key': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },

  // React Hooks configuration
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },

  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Global ignores
  {
    ignores: [
      // Build outputs
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'node_modules/**',

      // Config files that cause issues
      '**/*.config.ts',
      '**/*.config.js',
      'auth0-config.ts',
      'react-table-config.d.ts',
      'cypress.config.ts',

      // Any other problematic files
      '**/chunks/**',
      '**/server/**',
    ],
  },

  // Global rules for all files
  {
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
];

export default eslintConfig;
