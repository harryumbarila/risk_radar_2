const reactBase = require('./react-ts');

module.exports = (dirname) => {
  const config = reactBase(dirname);

  return {
    ...config,
    extends: [...config.extends, 'plugin:@next/next/recommended'],
    rules: {
      ...config.rules,
      'jsx-a11y/alt-text': [
        'error',
        {
          elements: ['img'],
          img: ['Image'],
        },
      ],
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['jsx', 'global'],
        },
      ],
    },
  };
};
