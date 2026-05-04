import { createContentCollectionPlugin } from '@content-collections/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/search', '@repo/ui'],
  typedRoutes: true,
  async headers() {
    return [
      {
        source: '/search-index.json',
        headers: [
          // Stable filenames should not be treated as immutable.
          // When these assets become hash-versioned, switch to `max-age=31536000, immutable`.
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/search-docs.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  turbopack: {
    root: process.cwd().replace(/\/apps\/web$/, ''),
  },
};

const withContentCollections = createContentCollectionPlugin({
  configPath: './content-collections.ts',
});

export default withContentCollections(nextConfig);
