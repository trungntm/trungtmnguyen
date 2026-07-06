import { getAllPublishedPosts } from '@/features/cms-blog/api/cms-blog-api';
import { buildAbsoluteUrl, siteConfig } from '@/lib/seo';

export const revalidate = 60;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const blogUrl = buildAbsoluteUrl('/blog');
  let posts: Awaited<ReturnType<typeof getAllPublishedPosts>> = [];

  try {
    posts = await getAllPublishedPosts();
  } catch {
    posts = [];
  }

  const items = posts
    .map((post) => {
      const postUrl = buildAbsoluteUrl(post.url);
      const description = post.description ?? '';
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag.name)}</category>`)
        .join('');

      return [
        '<item>',
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(postUrl)}</link>`,
        `<guid>${escapeXml(postUrl)}</guid>`,
        `<pubDate>${escapeXml(new Date(post.publishedAt).toUTCString())}</pubDate>`,
        `<description>${escapeXml(description)}</description>`,
        categories,
        '</item>',
      ].join('');
    })
    .join('');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(siteConfig.title)}</title>`,
    `<link>${escapeXml(blogUrl)}</link>`,
    `<description>${escapeXml(siteConfig.description)}</description>`,
    `<language>en-us</language>`,
    `<atom:link href="${escapeXml(buildAbsoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />`,
    `<docs>${escapeXml('https://www.rssboard.org/rss-specification')}</docs>`,
    `<generator>Next.js</generator>`,
    `<ttl>60</ttl>`,
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
