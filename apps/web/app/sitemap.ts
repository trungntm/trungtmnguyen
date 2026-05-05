import type { MetadataRoute } from 'next';

import { getAllTags, getBlogsByTag } from '@/lib/blogs';
import { siteConfig } from '@/lib/seo';
import { allBlogs } from 'content-collections';

const staticPages = ['/', '/about', '/blog', '/tags'] as const;

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

  const tagEntries = getAllTags().map((tag) => {
    const newestBlog = getBlogsByTag(tag.slug)[0];

    return {
      url: `${siteConfig.url}/tags/${tag.slug}`,
      lastModified: newestBlog?.updatedAt || newestBlog?.publishedAt || lastModified,
    };
  });

  return [...staticEntries, ...blogEntries, ...tagEntries];
}
