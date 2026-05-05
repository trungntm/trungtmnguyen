import type { MetadataRoute } from 'next';

import { allBlogs } from 'content-collections';

import { siteConfig } from '@/lib/seo';

const staticPages = ['/', '/about', '/blog'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticEntries = staticPages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
  }));

  const blogEntries = allBlogs
    .filter((blog) => !blog.draft)
    .map((blog) => ({
      url: `${siteConfig.url}${blog.url}`,
      lastModified: blog.updatedAt || blog.publishedAt,
    }));

  return [...staticEntries, ...blogEntries];
}
