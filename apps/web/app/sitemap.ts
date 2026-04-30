import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/seo';

const routes = ['/', '/about', '/blog'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: new URL(route, siteConfig.siteUrl).toString(),
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
