import type { MetadataRoute } from 'next';

import { getPublishedBlogs } from '@/lib/blogs';
import { siteConfig } from '@/lib/seo';

const staticRoutes = [
  {
    route: '/',
    lastModified: new Date('2026-05-03'),
    changeFrequency: 'weekly' as const,
    priority: 1,
  },
  {
    route: '/about',
    lastModified: new Date('2026-05-03'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    route: '/blog',
    lastModified: new Date('2026-05-03'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = getPublishedBlogs().map((blog) => ({
    url: new URL(blog.url, siteConfig.siteUrl).toString(),
    lastModified: new Date(blog.updatedAt ?? blog.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes.map((entry) => ({
      url: new URL(entry.route, siteConfig.siteUrl).toString(),
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...blogEntries,
  ];
}
