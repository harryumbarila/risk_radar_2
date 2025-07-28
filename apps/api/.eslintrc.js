module.exports = {
  extends: [
    '@denali/eslint-config/node-ts',
    '@denali/eslint-config/jest-overrides',
    'plugin:@darraghor/nestjs-typed/recommended',
  ],
  plugins: ['@darraghor/nestjs-typed'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Disable function explicit return type
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/unbound-method': 'off',

    // Classes management
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',

    // Env
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
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['packages/*/tsconfig.json', 'tsconfig.json'],
      },
    },
  },
  overrides: [
    {
      files: [
        'test/*.e2e.spec.ts',
        '**/test/**/*.e2e.spec.ts',
        '**/test/*.unit.spec.ts',
        '**/test/**/*.unit.spec.ts',
      ],
      // We allow any on tests for easier mocking
      rules: {
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
    {
      files: ['src/config/env.ts'],
      rules: {
        'no-restricted-properties': 'off',
      },
    },
  ],
  ignorePatterns: ['jest-unit.ts', 'jest-e2e.ts'],
};
