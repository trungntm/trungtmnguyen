import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@trungtmnguyen/search', '@trungtmnguyen/ui'],
  typedRoutes: true,
  turbopack: {
    root: process.cwd().replace(/\/apps\/web$/, ''),
  },
};

export default nextConfig;
