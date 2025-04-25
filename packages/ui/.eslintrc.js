module.exports = {
  root: true,
  extends: [
    '@denali/eslint-config/react-ts',
    '@denali/eslint-config/jest-react-overrides',
    // 'plugin:tailwindcss/recommended',
  ],
  ignorePatterns: ['node_modules', 'dist'],
  settings: {
    // TODO: Enable this when moving the components to the package
    // tailwindcss: {
    //   config: require('./tailwind.config.js'),
    // },
  },
  plugins: ['unused-imports'],
  rules: {
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
  },
  ignorePatterns: ['react-table-config.d.ts'],
};
