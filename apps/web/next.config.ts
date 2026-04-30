import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  turbopack: {
    root: process.cwd().replace(/\/apps\/web$/, ''),
  },
};

export default nextConfig;
