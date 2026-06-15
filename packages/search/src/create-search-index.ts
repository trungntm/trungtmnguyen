import { createMiniSearch } from './minisearch-config';
import { stripMdxContent } from './mdx-normalizer';
import type { SearchIndexDocument } from './minisearch-config';
import type { SearchRenderDocument } from './types';

type SearchSourceBlog = {
  id: string;
  locale: string;
  slug: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  publishedAt: string;
  draft?: boolean;
  content: string;
  readingTime?: {
    text?: string;
  };
};

export function createSearchIndex(blogs: SearchSourceBlog[]) {
  const miniSearch = createMiniSearch();
  const docsById: Record<string, SearchRenderDocument> = {};

  const documents = blogs
    .filter((blog) => !blog.draft)
    .map((blog): SearchIndexDocument => {
      const document: SearchIndexDocument = {
        id: blog.id,
        locale: blog.locale,
        title: blog.title,
        description: blog.description,
        url: blog.url,
        tags: blog.tags,
        publishedAt: blog.publishedAt,
        content: stripMdxContent(blog.content),
        tagsText: blog.tags.join(' '),
        ...(blog.readingTime?.text ? { readingTime: blog.readingTime.text } : {}),
      };

      docsById[document.id] = {
        id: document.id,
        locale: document.locale,
        title: document.title,
        description: document.description,
        url: document.url,
        tags: document.tags,
        publishedAt: document.publishedAt,
        ...(document.readingTime ? { readingTime: document.readingTime } : {}),
      };

      return document;
    });

  miniSearch.addAll(documents);

  return {
    indexJson: miniSearch.toJSON(),
    docsById,
  };
}
