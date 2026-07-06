import 'server-only';

import { cache } from 'react';

import type { BlogPreview } from '@/components/blog/blog-preview';
import { getAllPublishedPosts } from '@/features/cms-blog/api/cms-blog-api';
import { mapCmsPostToPostCardViewModel } from '@/features/cms-blog/view-models';
import type { Locale } from '@/lib/i18n';

import { normalizeTag } from './blogs';

export type TagSummary = {
  label: string;
  slug: string;
  count: number;
};

export type TagData = TagSummary & {
  locale: Locale;
  lastModified: string;
};

const getAllCmsPostsByLocale = cache(async (locale: Locale) => getAllPublishedPosts({ locale }));

function sortBlogs(blogs: BlogPreview[]) {
  return [...blogs].sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));
}

function buildTagData(posts: Awaited<ReturnType<typeof getAllCmsPostsByLocale>>, locale: Locale) {
  const tagMap = new Map<string, TagData>();

  for (const post of posts) {
    if (post.locale !== locale) {
      continue;
    }

    for (const tag of post.tags) {
      const label = tag.name.trim();

      if (!label) {
        continue;
      }

      const slug = normalizeTag(label);
      const existingTag = tagMap.get(slug);
      const lastModified = post.updatedAt || post.publishedAt;

      if (existingTag) {
        existingTag.count += 1;

        if (Date.parse(lastModified) > Date.parse(existingTag.lastModified)) {
          existingTag.lastModified = lastModified;
        }

        continue;
      }

      tagMap.set(slug, {
        locale,
        label,
        slug,
        count: 1,
        lastModified,
      });
    }
  }

  return [...tagMap.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export async function getPublishedBlogs(locale: Locale) {
  const posts = await getAllCmsPostsByLocale(locale);
  return sortBlogs(
    posts.map((post) => mapCmsPostToPostCardViewModel(post)),
  );
}

export async function getAllTags(locale: Locale) {
  const posts = await getAllCmsPostsByLocale(locale);
  return buildTagData(posts, locale).map(({ label, slug, count }) => ({ label, slug, count }));
}

export async function getTagLabelFromSlug(locale: Locale, tagSlug: string) {
  const normalizedTag = normalizeTag(tagSlug);
  return (await getAllTags(locale)).find((tag) => tag.slug === normalizedTag)?.label;
}

export async function getBlogsByTag(locale: Locale, tag: string) {
  const normalizedTag = normalizeTag(tag);
  const blogs = await getPublishedBlogs(locale);

  return blogs.filter((blog) => blog.tags.some((entry) => normalizeTag(entry) === normalizedTag));
}

export async function getTagData(locale: Locale, tag: string) {
  const posts = await getAllCmsPostsByLocale(locale);
  const normalizedTag = normalizeTag(tag);
  return buildTagData(posts, locale).find((entry) => entry.slug === normalizedTag) ?? null;
}
