const base = require('./base-ts');

module.exports = (dirname) => {
  const config = base(dirname);

  return {
    ...config,
    env: {
      browser: true,
      node: true,
    },
    extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript', ...config.extends],
    settings: {
      ...config.settings,
    },
    rules: {
      ...config.rules,
      // react
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
        },
      ],
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/react-in-jsx-scope': 'off',

      'jsx-a11y/label-has-associated-control': [
        'error',
        { controlComponents: ['Field'] },
      ],
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
        extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
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
  };
};
