import { allBlogs } from 'content-collections';
import tagData from '@/app/tag-data.json';

import { slugifyHeading } from '@/lib/slugify';

export type Blog = (typeof allBlogs)[number];
export type TagSummary = {
  label: string;
  slug: string;
  count: number;
};
export type TagData = TagSummary & {
  blogSlugs: string[];
  lastModified: string;
};

type BlogQueryOptions = {
  includeDrafts?: boolean;
};

const blogDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

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

export function getTagUrl(tag: string) {
  return `/tags/${normalizeTag(tag)}` as const;
}

export function getTagLabelFromSlug(tagSlug: string, options?: BlogQueryOptions) {
  if (!shouldIncludeDrafts(options)) {
    return getGeneratedTagData().find((tag) => tag.slug === normalizeTag(tagSlug))?.label;
  }

  const normalizedSlug = normalizeTag(tagSlug);

  const tagMap = new Map<string, string>();

  for (const blog of getAllBlogs(options)) {
    for (const tag of blog.tags) {
      const slug = normalizeTag(tag);
      if (!tagMap.has(slug)) {
        tagMap.set(slug, tag.trim());
      }
    }
  }

  return tagMap.get(normalizedSlug);
}

export function formatBlogDate(date: string) {
  return blogDateFormatter.format(new Date(date));
}

export function getAllBlogs(options?: BlogQueryOptions) {
  return sortBlogs(allBlogs.filter((blog) => isVisibleBlog(blog, options)));
}

export function getPublishedBlogs() {
  return getAllBlogs();
}

export function getBlogBySlug(slugSegments: string[], options?: BlogQueryOptions) {
  const slug = slugSegments.join('/');
  const blog = allBlogs.find((entry) => entry.slug === slug);

  if (!blog || !isVisibleBlog(blog, options)) {
    return null;
  }

  return blog;
}

export function getAllBlogSlugs(options?: BlogQueryOptions) {
  return getAllBlogs(options).map((blog) => blog.slugSegments);
}

export function getAllTags(options?: BlogQueryOptions) {
  if (!shouldIncludeDrafts(options)) {
    return getGeneratedTagData().map(({ label, slug, count }) => ({ label, slug, count }));
  }

  const tagMap = new Map<string, TagSummary>();

  for (const blog of getAllBlogs(options)) {
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

export function getBlogsByTag(tag: string, options?: BlogQueryOptions) {
  const normalizedTag = normalizeTag(tag);

  const blogs = getAllBlogs(options);

  if (!shouldIncludeDrafts(options)) {
    const slugSet = new Set(
      getGeneratedTagData().find((entry) => entry.slug === normalizedTag)?.blogSlugs ?? [],
    );

    return blogs.filter((blog) => slugSet.has(blog.slug));
  }

  return blogs.filter((blog) => blog.tags.some((entry) => normalizeTag(entry) === normalizedTag));
}

export function getTagData(tag: string) {
  const normalizedTag = normalizeTag(tag);
  return getGeneratedTagData().find((entry) => entry.slug === normalizedTag) ?? null;
}
