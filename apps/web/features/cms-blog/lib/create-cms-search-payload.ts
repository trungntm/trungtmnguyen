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

function deduplicatePosts(posts: Awaited<ReturnType<typeof getAllPublishedPosts>>) {
  const postMap = new Map<string, (typeof posts)[number]>();

  for (const post of posts) {
    const documentId = `${post.locale}:${post.id}`;
    const existingPost = postMap.get(documentId);

    if (!existingPost) {
      postMap.set(documentId, post);
      continue;
    }

    const existingTimestamp = Date.parse(existingPost.updatedAt || existingPost.publishedAt);
    const nextTimestamp = Date.parse(post.updatedAt || post.publishedAt);

    if (nextTimestamp >= existingTimestamp) {
      postMap.set(documentId, post);
    }
  }

  return [...postMap.values()];
}

async function buildCmsSearchPayload() {
  const posts = (
    await Promise.all(
      locales.map(async (locale) => getAllPublishedPosts({ locale })),
    )
  ).flat();

  return createSearchIndex(deduplicatePosts(posts).map(mapCmsPostToSearchSourcePost));
}

export const createCmsSearchPayload = unstable_cache(buildCmsSearchPayload, ['cms-search-payload'], {
  revalidate: 60,
});
