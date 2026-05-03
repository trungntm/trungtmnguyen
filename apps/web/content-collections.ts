import { defineCollection, defineConfig } from '@content-collections/core';
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
    const mdx = await compileMDX(context, document, {
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

export default defineConfig({
  content: [blogs],
});
