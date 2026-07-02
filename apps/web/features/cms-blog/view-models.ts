import type { Route } from 'next';

import type { PublicPostDetailDto, PublicPostListItemDto } from '@/features/cms-blog/types';

import type { BlogPreview } from '@/components/blog/blog-preview';

export function mapCmsPostToPostCardViewModel(
  post: PublicPostListItemDto | PublicPostDetailDto,
): BlogPreview {
  return {
    id: post.id,
    url: `/blog/${post.locale}/${post.slug}` as Route,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    tags: post.tags.map((tag) => tag.name),
    thumbnail: post.coverImageUrl,
    coverImageUrl: post.coverImageUrl,
    author: null,
    readingTime: null,
  };
}
