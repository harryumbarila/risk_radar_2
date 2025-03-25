const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  latex: true,
  flexsearch: {
    codeblock: false,
  },
});

const repoName = process.env.REPO_NAME || '';

module.exports = withNextra({
  reactStrictMode: true,
  output: 'export', // Ensures static export
  distDir: 'out',
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
  basePath: repoName ? `/${repoName}` : '',
  assetPrefix: repoName ? `/${repoName}/` : '',
});
