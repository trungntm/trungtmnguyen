import type { MetadataRoute } from 'next';

import { getAllPublishedPosts, getAllPublishedSeries } from '@/features/cms-blog/api/cms-blog-api';
import { getAllTags, getTagData } from '@/lib/blog-data';
import { locales } from '@/lib/i18n';
import { buildAbsoluteUrl } from '@/lib/seo';

type SitemapEntry = MetadataRoute.Sitemap[number];

export const revalidate = 60;

function getStaticEntries(lastModified: Date): SitemapEntry[] {
  const localizedEntries = locales.flatMap((locale) =>
    ['/', '/about', '/blog', '/series', '/tags'].map((path) => ({
      url: buildAbsoluteUrl(path === '/' ? `/${locale}` : `/${locale}${path}`),
      lastModified,
    })),
  );

  return [
    {
      url: buildAbsoluteUrl('/'),
      lastModified,
    },
    {
      url: buildAbsoluteUrl('/blog'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...localizedEntries,
  ];
}

async function getCmsEntries(): Promise<SitemapEntry[]> {
  const posts = await getAllPublishedPosts();
  const seriesEntries = (
    await Promise.all(locales.map(async (locale) => getAllPublishedSeries({ locale })))
  ).flat();
  const tagEntries = (
    await Promise.all(
      locales.map(async (locale) => {
        const tags = await getAllTags(locale);

        return Promise.all(
          tags.map(async (tag) => ({
            url: buildAbsoluteUrl(`/${locale}/tags/${tag.slug}`),
            lastModified: (await getTagData(locale, tag.slug))?.lastModified,
          })),
        );
      }),
    )
  ).flat();

  return [
    ...posts.map((post) => ({
      url: buildAbsoluteUrl(post.url),
      lastModified: post.updatedAt || post.publishedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
    ...seriesEntries.map((series) => ({
      url: buildAbsoluteUrl(series.url),
      lastModified: series.updatedAt || series.publishedAt,
      changeFrequency: 'weekly',
      priority: 0.65,
    })),
    ...tagEntries.map((entry) => ({
      url: entry.url,
      lastModified: entry.lastModified,
    })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticEntries = getStaticEntries(lastModified);

  try {
    const cmsEntries = await getCmsEntries();
    return [...staticEntries, ...cmsEntries];
  } catch {
    return staticEntries;
  }
}
