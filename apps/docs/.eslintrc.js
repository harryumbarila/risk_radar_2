module.exports = {
  root: true,
  extends: [
    '@denali/eslint-config/nextjs-ts',
    '@denali/eslint-config/jest-react-overrides',
    'plugin:tailwindcss/recommended',
    'plugin:i18next/recommended',
    'plugin:mdx/recommended',
  ],
  settings: {
    tailwindcss: {
      config: require('./tailwind.config.js'),
    },
  },
};
