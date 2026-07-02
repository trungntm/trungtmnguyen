import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { defineCollection, defineConfig, type Meta } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';

import { defaultLocale, locales } from './lib/i18n';
import { calculateReadingTime } from './lib/reading-time';
import { slugifyHeading } from './lib/slugify';
import { extractTocFromMarkdown } from './lib/toc';

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected an ISO date in YYYY-MM-DD format')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Expected a valid ISO date');

const socialSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
});

const labeledEntrySchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const titledItemsSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string().min(1)).default([]),
});

const activitySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const timelineLinkSchema = z.object({
  text: z.string().min(1),
  href: z.string().url(),
});

type CareerTimelineLink = {
  text: string;
  href: string;
};

type CareerTimelineItem = {
  company: string;
  project?: string | undefined;
  role: string;
  duration: string;
  description: string[];
  links: CareerTimelineLink[];
  projects: CareerTimelineItem[];
};

const careerTimelineItemSchema: z.ZodType<CareerTimelineItem> = z.lazy(() =>
  z.object({
    company: z.string().min(1),
    project: z.string().min(1).optional(),
    role: z.string().min(1),
    duration: z.string().min(1),
    description: z.array(z.string().min(1)).default([]),
    links: z.array(timelineLinkSchema).default([]),
    projects: z.array(careerTimelineItemSchema).default([]),
  }),
);

type MdxDocument = {
  _meta: Meta;
  content: string;
};

type SearchSourceBlog = {
  id: string;
  locale: (typeof locales)[number];
  slug: string;
  translationKey: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string | undefined;
  draft?: boolean;
  content: string;
  readingTime?: {
    text?: string;
  };
};

type TagDataEntry = {
  locale: (typeof locales)[number];
  label: string;
  slug: string;
  count: number;
  blogIds: string[];
  lastModified: string;
};

const CODE_BLOCK_PATTERN = /```[\s\S]*?```/g;
const IMPORT_EXPORT_PATTERN = /^\s*(?:import|export)\s.+$/gm;
const INLINE_CODE_PATTERN = /`([^`]+)`/g;
const MDX_COMPONENT_PATTERN = /<\/?[A-Z][^>\n]*\/?>/g;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const LINK_PATTERN = /!?\[([^\]]*)\]\(([^)]+)\)/g;
const MARKDOWN_SYMBOL_PATTERN = /[#>*_~|()[\]!-]+/g;
const WHITESPACE_PATTERN = /\s+/g;
const MAX_CONTENT_LENGTH = 10_000;

const appRoot = process.cwd().endsWith('/apps/web')
  ? process.cwd()
  : path.join(process.cwd(), 'apps', 'web');
const workspaceRoot = path.join(appRoot, '..', '..');
const searchPackageRequire = createRequire(path.join(workspaceRoot, 'packages', 'search', 'package.json'));
const MiniSearch = searchPackageRequire('minisearch');

function stripMdxContent(content: string) {
  return content
    .replace(CODE_BLOCK_PATTERN, ' ')
    .replace(IMPORT_EXPORT_PATTERN, ' ')
    .replace(INLINE_CODE_PATTERN, '$1')
    .replace(MDX_COMPONENT_PATTERN, ' ')
    .replace(HTML_TAG_PATTERN, ' ')
    .replace(LINK_PATTERN, '$1 $2')
    .replace(MARKDOWN_SYMBOL_PATTERN, ' ')
    .replace(WHITESPACE_PATTERN, ' ')
    .trim()
    .slice(0, MAX_CONTENT_LENGTH);
}

function createSearchIndex(blogs: SearchSourceBlog[]) {
  const miniSearch = new MiniSearch({
    fields: ['title', 'description', 'tagsText', 'content'],
    storeFields: ['id'],
    searchOptions: {
      boost: {
        title: 4,
        tagsText: 3,
        description: 2,
        content: 1,
      },
      prefix: true,
      fuzzy: 0.2,
    },
  });
  const docsById: Record<
    string,
    {
      id: string;
      locale: (typeof locales)[number];
      title: string;
      description: string;
      url: string;
      tags: string[];
      publishedAt: string;
      readingTime?: string;
    }
  > = {};

  const documents = blogs
    .filter((blog) => !blog.draft)
    .map((blog) => {
      const document = {
        id: blog.id,
        title: blog.title,
        description: blog.description,
        url: blog.url,
        tags: blog.tags,
        publishedAt: blog.publishedAt,
        locale: blog.locale,
        content: stripMdxContent(blog.content),
        tagsText: blog.tags.join(' '),
        ...(blog.readingTime?.text ? { readingTime: blog.readingTime.text } : {}),
      };

      docsById[document.id] = {
        id: document.id,
        title: document.title,
        description: document.description,
        url: document.url,
        tags: document.tags,
        publishedAt: document.publishedAt,
        locale: document.locale,
        ...(document.readingTime ? { readingTime: document.readingTime } : {}),
      };

      return document;
    });

  miniSearch.addAll(documents);

  return {
    docsById,
    indexJson: miniSearch.toJSON(),
  };
}

async function writeSearchAssets(blogs: SearchSourceBlog[]) {
  const { docsById, indexJson } = createSearchIndex(blogs);
  const publicDirectory = path.join(appRoot, 'public');

  await mkdir(publicDirectory, { recursive: true });
  await Promise.all([
    writeFile(path.join(publicDirectory, 'search-index.json'), JSON.stringify(indexJson, null, 2)),
    writeFile(path.join(publicDirectory, 'search-docs.json'), JSON.stringify(docsById, null, 2)),
  ]);
}

function normalizeTag(tag: string) {
  return slugifyHeading(tag);
}

function createTagData(blogs: SearchSourceBlog[]) {
  const tagMap = new Map<string, TagDataEntry>();

  for (const blog of blogs) {
    if (blog.draft) {
      continue;
    }

    for (const tag of blog.tags) {
      const normalizedTag = normalizeTag(tag);
      const tagId = `${blog.locale}:${normalizedTag}`;
      const existingTag = tagMap.get(tagId);
      const lastModified = blog.updatedAt ?? blog.publishedAt;

      if (existingTag) {
        existingTag.count += 1;
        existingTag.blogIds.push(blog.id);

        if (Date.parse(lastModified) > Date.parse(existingTag.lastModified)) {
          existingTag.lastModified = lastModified;
        }

        continue;
      }

      tagMap.set(tagId, {
        locale: blog.locale,
        label: tag.trim(),
        slug: normalizedTag,
        count: 1,
        blogIds: [blog.id],
        lastModified,
      });
    }
  }

  return [...tagMap.values()].sort((left, right) => left.label.localeCompare(right.label));
}

async function writeTagData(blogs: SearchSourceBlog[]) {
  const appDirectory = path.join(appRoot, 'app');
  const tagData = createTagData(blogs);

  await mkdir(appDirectory, { recursive: true });
  await writeFile(path.join(appDirectory, 'tag-data.json'), JSON.stringify(tagData, null, 2));
}

async function compileDocumentMdx(
  context: Parameters<typeof compileMDX>[0],
  document: MdxDocument,
) {
  return compileMDX(context, document, {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['heading-anchor'],
          },
        },
      ],
      [
        rehypePrettyCode,
        {
          keepBackground: false,
          theme: {
            light: 'github-light-default',
            dark: 'github-dark-default',
          },
        },
      ],
    ],
  });
}

const blogs = defineCollection({
  name: 'blogs',
  directory: 'data/blogs',
  include: '**/*.mdx',
  typeName: 'Blog',
  schema: z.object({
    locale: z.enum(locales),
    slug: z.string().min(1),
    translationKey: z.string().min(1),
    canonicalLocale: z.enum(locales).default(defaultLocale),
    title: z.string().min(1),
    description: z.string().min(1),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
    legacySlug: z.string().min(1).optional(),
    author: z.string().min(1),
    tags: z.array(z.string()).default([]),
    thumbnail: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const slug = document.slug;
    const slugSegments = [slug];
    const publishedAtDate = Date.parse(document.publishedAt);
    const updatedAtDate = document.updatedAt ? Date.parse(document.updatedAt) : null;
    const stats = calculateReadingTime(document.content);
    const toc = extractTocFromMarkdown(document.content);
    const mdx = await compileDocumentMdx(context, document);
    const id = `${document.locale}:${document.slug}`;
    const url = `/${document.locale}/blog/${document.slug}`;

    return {
      ...document,
      id,
      slug,
      slugSegments,
      url,
      readingTime: {
        text: stats.text,
        minutes: stats.minutes,
        time: stats.time,
        words: stats.words,
      },
      toc,
      publishedAtDate,
      updatedAtDate,
      mdx,
    };
  },
  onSuccess: async (documents) => {
    await writeSearchAssets(documents);
    await writeTagData(documents);
  },
});

const pages = defineCollection({
  name: 'pages',
  directory: 'data/pages',
  include: '**/*.mdx',
  typeName: 'Page',
  schema: z.object({
    title: z.string().min(1),
    headline: z.string().min(1),
    description: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
    avatarText: z.string().min(1),
    avatarImage: z.string().optional(),
    company: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    socials: z.array(socialSchema).optional(),
    quickFacts: z
      .array(
        z.object({
          label: z.string().min(1),
          value: z.string().min(1),
        }),
      )
      .optional(),
    skills: z.array(titledItemsSchema).optional(),
    activities: z.array(activitySchema).optional(),
    education: z.array(labeledEntrySchema).optional(),
    languages: z.array(z.string().min(1)).optional(),
    career: z.array(careerTimelineItemSchema).optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const slug = document._meta.path;
    const slugSegments = slug.split('/').filter(Boolean);
    const mdx = await compileDocumentMdx(context, document);

    return {
      ...document,
      slug,
      slugSegments,
      url: `/${slug}`,
      mdx,
    };
  },
});

export default defineConfig({
  content: [blogs, pages],
});
