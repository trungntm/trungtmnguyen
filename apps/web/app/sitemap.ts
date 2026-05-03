import type { MetadataRoute } from 'next';

import { getPublishedBlogs } from '@/lib/blogs';
import { siteConfig } from '@/lib/seo';

const routes = ['/', '/about', '/blog'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const blogEntries = getPublishedBlogs().map((blog) => ({
    url: new URL(blog.url, siteConfig.siteUrl).toString(),
    lastModified: new Date(blog.updatedAt ?? blog.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...routes.map((route) => ({
      url: new URL(route, siteConfig.siteUrl).toString(),
      lastModified: now,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.7,
    })),
    ...blogEntries,
  ];
}
