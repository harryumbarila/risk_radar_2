import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

const eslintConfig = defineConfig([
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // React configuration
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'react/no-unstable-nested-components': 'error',
      'react/no-array-index-key': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-array-index-key': 'off',
      'react/no-unstable-nested-components': 'off',
    },
  },

  // React Hooks configuration
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
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
      '@typescript-eslint/explicit-module-boundary-types': 'off',
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
      'tailwind.config.js',
      '.lintstagedrc.cjs',
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
]);

export default eslintConfig;
