import { notFound } from 'next/navigation';

import { getPublishedPosts } from '@/features/cms-blog/api/cms-blog-api';
import { getDictionary, isValidLocale } from '@/lib/i18n';
import { buildAbsoluteUrl } from '@/lib/seo';

export const revalidate = 60;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

type LocalizedRssRouteProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function GET(_: Request, { params }: LocalizedRssRouteProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  let response: Awaited<ReturnType<typeof getPublishedPosts>>;

  try {
    response = await getPublishedPosts({
      locale,
      page: 1,
      pageSize: 100,
    });
  } catch {
    response = {
      items: [],
      page: 1,
      pageSize: 100,
      total: 0,
    };
  }

  const items = response.items
    .map((post) => {
      const url = buildAbsoluteUrl(post.url);

      return [
        '<item>',
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid>${escapeXml(url)}</guid>`,
        `<pubDate>${escapeXml(new Date(post.publishedAt).toUTCString())}</pubDate>`,
        `<description>${escapeXml(post.description ?? '')}</description>`,
        ...post.tags.map((tag) => `<category>${escapeXml(tag.name)}</category>`),
        '</item>',
      ].join('');
    })
    .join('');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<rss version="2.0">',
    '<channel>',
    `<title>${escapeXml(dictionary.metadata.siteTitle)}</title>`,
    `<link>${escapeXml(buildAbsoluteUrl(`/${locale}`))}</link>`,
    `<description>${escapeXml(dictionary.rss.description)}</description>`,
    `<language>${escapeXml(dictionary.rss.language)}</language>`,
    items,
    '</channel>',
    '</rss>',
  ].join('');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
    },
  });
}
