/** @type {import('next').NextConfig} */
// Only enable static export for GitHub Pages (when NEXT_PUBLIC_BASE_PATH is set)
const isGithubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined && process.env.VERCEL === undefined;
const basePath = isGithubPages ? process.env.NEXT_PUBLIC_BASE_PATH : '';
const output = isGithubPages ? 'export' : undefined;

const nextConfig = {
  reactStrictMode: true,
  ...(basePath && { basePath }),
  ...(output && { output }),
  images: {
    unoptimized: isGithubPages, // Only unoptimized for static export
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  // Trailing slash for GitHub Pages
  ...(isGithubPages && { trailingSlash: true }),
};

export default nextConfig;
