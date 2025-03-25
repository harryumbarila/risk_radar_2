const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  latex: true,
  flexsearch: {
    codeblock: false,
  },
});

module.exports = withNextra({
  reactStrictMode: true,
  output: 'export', // Ensures static export
  distDir: 'out',
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
  basePath: '/Denali',
  assetPrefix: '/Denali/',
});
