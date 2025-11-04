import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: '/dashboard-v2',
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

export default nextConfig;
