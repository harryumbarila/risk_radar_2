module.exports = {
  overrides: [
    {
      env: {
        jest: true,
      },
      files: [
        'jest.setup.[jt]s',
        '**/__tests__/**/*.@(js|jsx|ts|tsx)',
        '**/?(*.)+(spec|test).@(js|jsx|ts|tsx)',
        'tests/**/*.@(js|jsx|ts|tsx)',
      ],
      extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
      rules: {
        'import/no-extraneous-dependencies': [
          'off',
          {
            devDependencies: [
              'jest.setup.[jt]s',
              '**/?(*.)+(spec|test).@(js|jsx|ts|tsx)',
            ],
          },
        ],
      },
    },
  ],
};
