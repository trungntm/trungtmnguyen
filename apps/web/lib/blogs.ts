import { allBlogs } from 'content-collections';

export type Blog = (typeof allBlogs)[number];

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

function normalizeTag(tag: string) {
  return tag.trim().toLocaleLowerCase();
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
  const tags = new Set<string>();

  for (const blog of getAllBlogs(options)) {
    for (const tag of blog.tags) {
      tags.add(tag);
    }
  }

  return [...tags].sort((left, right) => left.localeCompare(right));
}

export function getBlogsByTag(tag: string, options?: BlogQueryOptions) {
  const normalizedTag = normalizeTag(tag);

  return getAllBlogs(options).filter((blog) =>
    blog.tags.some((entry) => normalizeTag(entry) === normalizedTag),
  );
}
