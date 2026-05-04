import { createContentCollectionPlugin } from '@content-collections/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
  typedRoutes: true,
  turbopack: {
    root: process.cwd().replace(/\/apps\/web$/, ''),
  },
};

const withContentCollections = createContentCollectionPlugin({
  configPath: './content-collections.ts',
});

export default withContentCollections(nextConfig);
