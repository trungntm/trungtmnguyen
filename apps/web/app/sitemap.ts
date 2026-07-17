import type { MetadataRoute } from 'next';

import { getAllPublishedPosts, getAllPublishedSeries } from '@/features/cms-blog/api/cms-blog-api';
import { getAllTags, getTagData } from '@/lib/blog-data';
import { locales } from '@/lib/i18n';
import { buildAbsoluteUrl } from '@/lib/seo';

type SitemapEntry = MetadataRoute.Sitemap[number];

type GroupedEntry = {
  lastModified?: string | Date | undefined;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined;
  priority?: number | undefined;
  alternates: { languages: Record<string, string> };
};

export const revalidate = 60;

function getStaticEntries(lastModified: Date): SitemapEntry[] {
  const localizedEntries = locales.flatMap((locale) =>
    ['/', '/about', '/blog', '/series', '/tags'].map((path) => ({
      url: buildAbsoluteUrl(path === '/' ? `/${locale}` : `/${locale}${path}`),
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, buildAbsoluteUrl(path === '/' ? `/${l}` : `/${l}${path}`)])
        ),
      },
    })),
  );

  return [
    {
      url: buildAbsoluteUrl('/'),
      lastModified,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, buildAbsoluteUrl(`/${l}`)]))
      }
    },
    {
      url: buildAbsoluteUrl('/blog'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, buildAbsoluteUrl(`/${l}/blog`)]))
      }
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

  const postSitemapEntries = Object.values(
    posts.reduce((acc, post) => {
      if (!acc[post.id]) {
        acc[post.id] = {
          lastModified: post.updatedAt || post.publishedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: { languages: {} },
        };
      }
      
      const currentEntry = acc[post.id]!;
      currentEntry.alternates.languages[post.locale] = buildAbsoluteUrl(post.url);
      
      const currentLastModified = new Date(currentEntry.lastModified as string | Date).getTime();
      const postLastModified = new Date(post.updatedAt || post.publishedAt).getTime();
      if (postLastModified > currentLastModified) {
        currentEntry.lastModified = post.updatedAt || post.publishedAt;
      }
      
      return acc;
    }, {} as Record<string, GroupedEntry>)
  ).flatMap((entry): SitemapEntry[] => {
    return Object.entries(entry.alternates.languages).map(([_locale, url]) => ({
      url,
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: entry.alternates,
    }));
  });

  const seriesSitemapEntries = Object.values(
    seriesEntries.reduce((acc, series) => {
      if (!acc[series.id]) {
        acc[series.id] = {
          lastModified: series.updatedAt || series.publishedAt,
          changeFrequency: 'weekly',
          priority: 0.65,
          alternates: { languages: {} },
        };
      }
      
      const currentEntry = acc[series.id]!;
      currentEntry.alternates.languages[series.locale] = buildAbsoluteUrl(series.url);
      
      const currentLastModified = new Date(currentEntry.lastModified as string | Date).getTime();
      const seriesLastModified = new Date(series.updatedAt || series.publishedAt).getTime();
      if (seriesLastModified > currentLastModified) {
        currentEntry.lastModified = series.updatedAt || series.publishedAt;
      }
      
      return acc;
    }, {} as Record<string, GroupedEntry>)
  ).flatMap((entry): SitemapEntry[] => {
    return Object.entries(entry.alternates.languages).map(([_locale, url]) => ({
      url,
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: entry.alternates,
    }));
  });

  const tagSitemapEntries = Object.values(
    tagEntries.reduce((acc, tagEntry) => {
      const url = new URL(tagEntry.url);
      const urlParts = url.pathname.split('/').filter(Boolean);
      const slug = urlParts[urlParts.length - 1];
      const locale = urlParts[0];
      
      if (!slug || !locale) {
        return acc;
      }
      
      if (!acc[slug]) {
        acc[slug] = {
          lastModified: tagEntry.lastModified,
          alternates: { languages: {} },
        };
      }
      
      const currentEntry = acc[slug]!;
      currentEntry.alternates.languages[locale] = tagEntry.url;
      
      if (tagEntry.lastModified && currentEntry.lastModified) {
        const currentLastModified = new Date(currentEntry.lastModified).getTime();
        const tagLastModified = new Date(tagEntry.lastModified).getTime();
        if (tagLastModified > currentLastModified) {
          currentEntry.lastModified = tagEntry.lastModified;
        }
      } else if (tagEntry.lastModified) {
        currentEntry.lastModified = tagEntry.lastModified;
      }
      
      return acc;
    }, {} as Record<string, GroupedEntry>)
  ).flatMap((entry): SitemapEntry[] => {
    return Object.entries(entry.alternates.languages).map(([_locale, url]) => ({
      url,
      lastModified: entry.lastModified,
      alternates: entry.alternates,
    }));
  });

  return [
    ...postSitemapEntries,
    ...seriesSitemapEntries,
    ...tagSitemapEntries,
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
