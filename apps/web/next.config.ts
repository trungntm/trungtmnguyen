import type { NextConfig } from 'next';
import { getRedirects } from './features/redirects/get-redirects';

function getCmsConnectSource() {
  const cmsBaseUrl = process.env.CMS_BASE_URL?.trim();

  if (!cmsBaseUrl) {
    return '';
  }

  try {
    const url = new URL(cmsBaseUrl);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : '';
  } catch {
    return '';
  }
}

const cmsConnectSource = getCmsConnectSource();

const ContentSecurityPolicy = `
  default-src 'self';

  script-src
    'self'
    'unsafe-inline'
    'unsafe-eval'
    www.googletagmanager.com
    www.google-analytics.com
    cloud.umami.is
    challenges.cloudflare.com
    va.vercel-scripts.com
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
    gateway.umami.is
    challenges.cloudflare.com
    ${cmsConnectSource};

  font-src
    'self'
    data:;

  frame-src
    challenges.cloudflare.com
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
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@trungtmnguyen/blog-comments',
    '@trungtmnguyen/analytics',
    '@trungtmnguyen/search',
    '@trungtmnguyen/ui',
  ],
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
      {
        protocol: 'http',
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
  async redirects() {
    return getRedirects();
  },
};

export default nextConfig;
