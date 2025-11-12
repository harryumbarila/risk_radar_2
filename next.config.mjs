/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
const basePath = isGithubPages ? process.env.NEXT_PUBLIC_BASE_PATH : '';
const output = isGithubPages ? 'export' : undefined;

const nextConfig = {
  reactStrictMode: true,
  ...(basePath && { basePath }),
  ...(output && { output }),
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  // Trailing slash for GitHub Pages
  ...(isGithubPages && { trailingSlash: true }),
  // Skip API routes and middleware for static export
  ...(output === 'export' && {
    distDir: 'out',
  }),
};

export default nextConfig;
