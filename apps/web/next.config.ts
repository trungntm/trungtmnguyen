import type { NextConfig } from 'next';

const ContentSecurityPolicy = `
  default-src 'self';

  script-src
    'self'
    'unsafe-inline'
    'unsafe-eval'
    www.googletagmanager.com
    www.google-analytics.com
    cloud.umami.is
    giscus.app;

  style-src
    'self'
    'unsafe-inline';

  img-src
    'self'
    data:
    blob:
    http:
    https:;

  connect-src
    'self'
    www.google-analytics.com
    region1.google-analytics.com
    cloud.umami.is
    studio.trungtmnguyen.com;

  font-src
    'self'
    data:;

  frame-src
    giscus.app;

  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
`;


const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@trungtmnguyen/analytics', '@trungtmnguyen/search', '@trungtmnguyen/ui'],
  typedRoutes: true,
  turbopack: {
    root: process.cwd().replace(/\/apps\/web$/, ''),
  },
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
