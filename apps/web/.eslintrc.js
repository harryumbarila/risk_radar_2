module.exports = {
  root: true,
  extends: [
    '@denali/eslint-config/nextjs-ts',
    '@denali/eslint-config/jest-react-overrides',
    // "plugin:tailwindcss/recommended",
  ],
  plugins: ['unused-imports'],
  rules: {
    // Allow the return keyword in else blocks to a easy code remove for the scripts
    'no-else-return': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
    ],
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
  overrides: [
    {
      files: ['src/config/env.ts'],
      rules: {
        'no-restricted-properties': 'off',
      },
    },
  ],
  settings: {
    tailwindcss: {
      config: require('./tailwind.config.js'),
    },
  },
  ignorePatterns: [
    'auth0-config.ts',
    'react-table-config.d.ts',
    'cypress.config.ts',
  ],
};
