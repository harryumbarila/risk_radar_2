import eslintNestJsTyped from '@darraghor/eslint-plugin-nestjs-typed';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'off',
    },
  },
  ...eslintNestJsTyped.configs.flatRecommended,
  {
    rules: {
      '@darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator':
        'off',
      '@darraghor/nestjs-typed/api-enum-property-best-practices': 'off',
      '@darraghor/nestjs-typed/injectable-should-be-provided': 'off',
      '@darraghor/nestjs-typed/all-properties-have-explicit-defined': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'max-classes-per-file': 'off',
      'class-methods-use-this': 'off',
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            'Avoid using process.env directly. Use @/config/* files instead.',
        },
      ],
    },
  },

  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['packages/*/tsconfig.json', 'tsconfig.json'],
        },
      },
    },
  },

  // Test files
  {
    files: [
      'test/*.e2e.spec.ts',
      '**/test/**/*.e2e.spec.ts',
      '**/test/*.unit.spec.ts',
      '**/test/**/*.unit.spec.ts',
    ],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },

  // Env config file
  {
    files: ['src/config/env.ts'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },

  {
    ignores: [
      'jest-unit.ts',
      'jest-e2e.ts',
      'node_modules/**',
      'dist/**',
      '.lintstagedrc.cjs',
      'build/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
];
