import { allBlogs } from 'content-collections';
import tagData from '@/app/tag-data.json';

import { type Locale, defaultLocale } from '@/lib/i18n';
import { slugifyHeading } from '@/lib/slugify';

export type Blog = (typeof allBlogs)[number];
export type TagSummary = {
  label: string;
  slug: string;
  count: number;
};
export type TagData = TagSummary & {
  locale: Locale;
  blogIds: string[];
  lastModified: string;
};

type BlogQueryOptions = {
  includeDrafts?: boolean;
};

const blogDateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  vi: new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
  en: new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
};

function shouldIncludeDrafts(options?: BlogQueryOptions) {
  return options?.includeDrafts ?? false;
}

function isVisibleBlog(blog: Blog, options?: BlogQueryOptions) {
  return shouldIncludeDrafts(options) || !blog.draft;
}

function sortBlogs(blogs: Blog[]) {
  return [...blogs].sort((left, right) => right.publishedAtDate - left.publishedAtDate);
}

export function normalizeTag(tag: string) {
  return slugifyHeading(tag);
}

function getGeneratedTagData() {
  return tagData as TagData[];
}

export function formatBlogDate(date: string, locale: Locale = defaultLocale) {
  return blogDateFormatters[locale].format(new Date(date));
}

export function getLocalizedBlogUrl(locale: Locale, slug: string) {
  return `/${locale}/blog/${slug}` as const;
}

export function getTagUrl(locale: Locale, tag: string) {
  return `/${locale}/tags/${normalizeTag(tag)}` as const;
}

export function getPostsByLocale(locale: Locale, options?: BlogQueryOptions) {
  return sortBlogs(allBlogs.filter((blog) => blog.locale === locale && isVisibleBlog(blog, options)));
}

export function getPublishedBlogs(locale: Locale) {
  return getPostsByLocale(locale);
}

export function getPostBySlug(locale: Locale, slug: string, options?: BlogQueryOptions) {
  const blog = allBlogs.find((entry) => entry.locale === locale && entry.slug === slug);

  if (!blog || !isVisibleBlog(blog, options)) {
    return null;
  }

  return blog;
}

export function getPostByLegacySlug(legacySlug: string, locale: Locale = defaultLocale) {
  const normalizedSlug = legacySlug.replace(/^\/+|\/+$/g, '');
  const blog = allBlogs.find(
    (entry) =>
      entry.locale === locale &&
      isVisibleBlog(entry) &&
      (entry.legacySlug === normalizedSlug || entry.slug === normalizedSlug),
  );

  return blog ?? null;
}

export function getTranslationsByKey(translationKey: string, options?: BlogQueryOptions) {
  return sortBlogs(
    allBlogs.filter(
      (blog) => blog.translationKey === translationKey && isVisibleBlog(blog, options),
    ),
  );
}

export function getPostTranslation(
  post: Pick<Blog, 'translationKey'>,
  targetLocale: Locale,
  options?: BlogQueryOptions,
) {
  return (
    getTranslationsByKey(post.translationKey, options).find((entry) => entry.locale === targetLocale) ??
    null
  );
}

export function getAllBlogParams(options?: BlogQueryOptions) {
  return allBlogs
    .filter((blog) => isVisibleBlog(blog, options))
    .map((blog) => ({
      locale: blog.locale,
      slug: blog.slug,
    }));
}

export function getAllTags(locale: Locale, options?: BlogQueryOptions) {
  if (!shouldIncludeDrafts(options)) {
    return getGeneratedTagData()
      .filter((tag) => tag.locale === locale)
      .map(({ label, slug, count }) => ({ label, slug, count }));
  }

  const tagMap = new Map<string, TagSummary>();

  for (const blog of getPostsByLocale(locale, options)) {
    for (const tag of blog.tags) {
      const slug = normalizeTag(tag);
      const existingTag = tagMap.get(slug);

      if (existingTag) {
        existingTag.count += 1;
        continue;
      }

      tagMap.set(slug, {
        label: tag.trim(),
        slug,
        count: 1,
      });
    }
  }

  return [...tagMap.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function getTagLabelFromSlug(locale: Locale, tagSlug: string, options?: BlogQueryOptions) {
  if (!shouldIncludeDrafts(options)) {
    return getGeneratedTagData().find(
      (tag) => tag.locale === locale && tag.slug === normalizeTag(tagSlug),
    )?.label;
  }

  const normalizedSlug = normalizeTag(tagSlug);
  const tagMap = new Map<string, string>();

  for (const blog of getPostsByLocale(locale, options)) {
    for (const tag of blog.tags) {
      const slug = normalizeTag(tag);
      if (!tagMap.has(slug)) {
        tagMap.set(slug, tag.trim());
      }
    }
  }

  return tagMap.get(normalizedSlug);
}

export function getBlogsByTag(locale: Locale, tag: string, options?: BlogQueryOptions) {
  const normalizedTag = normalizeTag(tag);
  const blogs = getPostsByLocale(locale, options);

  if (!shouldIncludeDrafts(options)) {
    const blogIdSet = new Set(
      getGeneratedTagData().find(
        (entry) => entry.locale === locale && entry.slug === normalizedTag,
      )?.blogIds ?? [],
    );

    return blogs.filter((blog) => blogIdSet.has(blog.id));
  }

  return blogs.filter((blog) => blog.tags.some((entry) => normalizeTag(entry) === normalizedTag));
}

export function getTagData(locale: Locale, tag: string) {
  const normalizedTag = normalizeTag(tag);
  return (
    getGeneratedTagData().find(
      (entry) => entry.locale === locale && entry.slug === normalizedTag,
    ) ?? null
  );
}
