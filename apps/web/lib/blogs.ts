import { allBlogs } from 'content-collections';

import { slugifyHeading } from '@/lib/slugify';

export type Blog = (typeof allBlogs)[number];
export type TagSummary = {
  label: string;
  slug: string;
  count: number;
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

function buildTagSummaries(blogs: Blog[]) {
  const tagMap = new Map<string, TagSummary>();

  for (const blog of blogs) {
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

export function getTagUrl(tag: string) {
  return `/tags/${normalizeTag(tag)}` as const;
}

export function getTagLabelFromSlug(tagSlug: string, options?: BlogQueryOptions) {
  const normalizedSlug = normalizeTag(tagSlug);

  return buildTagSummaries(getAllBlogs(options)).find((tag) => tag.slug === normalizedSlug)?.label;
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
  return buildTagSummaries(getAllBlogs(options));
}

export function getBlogsByTag(tag: string, options?: BlogQueryOptions) {
  const normalizedTag = normalizeTag(tag);

  return getAllBlogs(options).filter((blog) =>
    blog.tags.some((entry) => normalizeTag(entry) === normalizedTag),
  );
}
