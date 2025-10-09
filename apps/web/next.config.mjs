/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
  typescript: {
    ignoreBuildErrors: !!process.env.CI,
    tsconfigPath: 'tsconfig.build.json',
  },
  transpilePackages: ['@denali/shared', '@denali/ui'],
};

export default nextConfig;
