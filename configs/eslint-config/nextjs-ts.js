module.exports = {
  extends: ['plugin:@next/next/recommended', require.resolve('./react-ts')],
  rules: {
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
  overrides: [
    {
      files: [
        'src/middleware.ts',
        'src/pages/**/*.{ts,tsx}',
        'src/app/**/{layout,page,loading,not-found,error}.tsx',
        'src/app/**/route.ts',
      ],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
