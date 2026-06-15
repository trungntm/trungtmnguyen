import type { MetadataRoute } from 'next';

import { getAllTags, getTagData, getTranslationsByKey } from '@/lib/blogs';
import { locales } from '@/lib/i18n';
import { buildAbsoluteUrl } from '@/lib/seo';
import { allBlogs } from 'content-collections';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticEntries = locales.flatMap((locale) =>
    ['/', '/about', '/blog', '/tags'].map((path) => ({
      url: buildAbsoluteUrl(path === '/' ? `/${locale}` : `/${locale}${path}`),
      lastModified,
    })),
  );

  const blogEntries = allBlogs
    .filter((blog) => !blog.draft)
    .map((blog) => ({
      url: buildAbsoluteUrl(blog.url),
      lastModified: blog.updatedAt || blog.publishedAt,
      alternates: {
        languages: Object.fromEntries(
          getTranslationsByKey(blog.translationKey).map((translation) => [
            translation.locale,
            buildAbsoluteUrl(translation.url),
          ]),
        ),
      },
    }));

  const tagEntries = locales.flatMap((locale) =>
    getAllTags(locale).map((tag) => ({
      url: buildAbsoluteUrl(`/${locale}/tags/${tag.slug}`),
      lastModified: getTagData(locale, tag.slug)?.lastModified || lastModified,
    })),
  );

  return [...staticEntries, ...blogEntries, ...tagEntries];
}
