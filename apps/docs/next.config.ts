/* eslint-disable import/no-default-export */
import nextra from 'nextra';

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false,
  },
});

const repoName = process.env.REPO_NAME || '';

export default withNextra({
  reactStrictMode: true,
  output: 'export', // Ensures static export
  distDir: 'out',
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
  basePath: repoName ? `/${repoName}` : '',
  assetPrefix: repoName ? `/${repoName}/` : '',
});
