import { allBlogs } from 'content-collections';

import { siteConfig } from '@/lib/seo';

const feedTitle = 'Trung Nguyen - Software Engineering Blog';
const feedDescription = 'Practical notes about software engineering';
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

export async function GET() {
  const blogs = [...allBlogs]
    .filter((blog) => !blog.draft)
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));

  const items = blogs
    .map((blog) => {
      const url = `${siteConfig.url}${blog.url}`;
      const preview = truncateContent(blog.content.trim(), contentPreviewLimit);
      const description = preview
        ? `${blog.description}\n\n${preview}`
        : blog.description;

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
    `<title>${escapeXml(feedTitle)}</title>`,
    `<link>${escapeXml(siteConfig.url)}</link>`,
    `<description>${escapeXml(feedDescription)}</description>`,
    '<language>en-us</language>',
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
