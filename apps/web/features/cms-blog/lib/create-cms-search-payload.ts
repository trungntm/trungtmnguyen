import { createSearchIndex } from '@trungtmnguyen/search';
import { unstable_cache } from 'next/cache';

import { getAllPublishedPosts } from '@/features/cms-blog/api/cms-blog-api';
import { locales } from '@/lib/i18n';

type CmsSearchSourcePost = {
  id: string;
  locale: string;
  slug: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  publishedAt: string;
  content: string;
};

function mapCmsPostToSearchSourcePost(post: Awaited<ReturnType<typeof getAllPublishedPosts>>[number]) {
  const tagNames = post.tags.map((tag) => tag.name.trim()).filter(Boolean);
  const tagCodes = post.tags.map((tag) => tag.code.trim()).filter(Boolean);
  const description = post.description ?? '';
  const keywords = [post.slug, post.locale, ...tagNames, ...tagCodes, description]
    .filter(Boolean)
    .join(' ');
  const documentId = `${post.locale}:${post.id}`;

  return {
    id: documentId,
    locale: post.locale,
    slug: post.slug,
    title: post.title,
    description,
    url: post.url,
    tags: tagNames,
    publishedAt: post.publishedAt,
    content: keywords,
  } satisfies CmsSearchSourcePost;
}

async function buildCmsSearchPayload() {
  const posts = (
    await Promise.all(
      locales.map(async (locale) => getAllPublishedPosts({ locale })),
    )
  ).flat();

  return createSearchIndex(posts.map(mapCmsPostToSearchSourcePost));
}

export const createCmsSearchPayload = unstable_cache(buildCmsSearchPayload, ['cms-search-payload'], {
  revalidate: 60,
});
