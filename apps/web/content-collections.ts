import { defineCollection, defineConfig, type Meta } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';

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

type MdxDocument = {
  _meta: Meta;
  content: string;
};

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
    title: z.string().min(1),
    description: z.string().min(1),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
    author: z.string().min(1),
    tags: z.array(z.string()).default([]),
    thumbnail: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const slug = document._meta.path;
    const slugSegments = slug.split('/').filter(Boolean);
    const publishedAtDate = Date.parse(document.publishedAt);
    const updatedAtDate = document.updatedAt ? Date.parse(document.updatedAt) : null;
    const stats = readingTime(document.content);
    const mdx = await compileDocumentMdx(context, document);

    return {
      ...document,
      slug,
      slugSegments,
      url: `/blog/${slug}`,
      readingTime: {
        text: stats.text,
        minutes: stats.minutes,
        time: stats.time,
        words: stats.words,
      },
      publishedAtDate,
      updatedAtDate,
      mdx,
    };
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
    career: z.array(labeledEntrySchema).optional(),
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
