import { allBlogs } from 'content-collections';
import { notFound } from 'next/navigation';

import { getDictionary, isValidLocale } from '@/lib/i18n';
import { buildAbsoluteUrl } from '@/lib/seo';

const contentPreviewLimit = 1200;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function escapeCdata(value: string) {
  return value.replaceAll(']]>', ']]]]><![CDATA[>');
}

function truncateContent(value: string, limit: number) {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit).trimEnd()}...`;
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
  const blogs = [...allBlogs]
    .filter((blog) => !blog.draft && blog.locale === locale)
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));

  const items = blogs
    .map((blog) => {
      const url = buildAbsoluteUrl(blog.url);
      const preview = truncateContent(blog.content.trim(), contentPreviewLimit);
      const description = preview ? `${blog.description}\n\n${preview}` : blog.description;

      return [
        '<item>',
        `<title>${escapeXml(blog.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid>${escapeXml(url)}</guid>`,
        `<pubDate>${escapeXml(new Date(blog.publishedAt).toUTCString())}</pubDate>`,
        `<description><![CDATA[${escapeCdata(description)}]]></description>`,
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
      'Content-Type': 'application/rss+xml',
    },
  });
}
