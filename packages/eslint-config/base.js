/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['plugin:import/recommended', 'plugin:prettier/recommended'],
  plugins: ['import', 'simple-import-sort', 'prettier'],
  rules: {
    // imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['src/**/*', '../**/*'],
            message:
              'usage of src/* and ../**/* imports is not allowed, use paths defined in tsconfig',
          },
        ],
      },
    ],
    'import/prefer-default-export': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  overrides: [
    {
      env: {
        jest: true,
      },
      files: [
        'jest.setup.[jt]s',
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      extends: ['plugin:jest/recommended'],
      rules: {
        'import/no-extraneous-dependencies': [
          'off',
          {
            devDependencies: [
              'jest.setup.[jt]s',
              '**/?(*.)+(spec|test).[jt]s?(x)',
            ],
          },
        ],
      },
    },
  ],
  ignorePatterns: [
    '.eslintrc.js',
    '**/*.json',
    'node_modules',
    'public',
    'styles',
    'coverage',
    'dist',
    '.turbo',
  ],
};
