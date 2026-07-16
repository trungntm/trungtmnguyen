import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';

import matter from 'gray-matter';
import { z } from 'zod';

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

type CareerTimelineItem = {
  company: string;
  project?: string | undefined;
  role: string;
  duration: string;
  description: string[];
  links: {
    text: string;
    href: string;
  }[];
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

const pageSchema = z.object({
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
});

export type Page = z.infer<typeof pageSchema> & {
  slug: string;
  url: string;
  contentMd: string;
};

const appRoot = process.cwd().endsWith('/apps/web')
  ? process.cwd()
  : path.join(process.cwd(), 'apps', 'web');

function normalizeSlug(slug: string) {
  return slug.replace(/^\/+|\/+$/g, '');
}

const getPageBySlugCached = cache(async (slug: string, locale: string): Promise<Page | null> => {
  const normalizedSlug = normalizeSlug(slug);
  const filePath = path.join(appRoot, 'data', 'pages', normalizedSlug, `${locale}.mdx`);

  try {
    const source = await readFile(filePath, 'utf8');
    const parsed = matter(source);
    const data = pageSchema.parse(parsed.data);

    return {
      ...data,
      slug: normalizedSlug,
      url: `/${locale}/${normalizedSlug}`,
      contentMd: parsed.content.trim(),
    };
  } catch {
    return null;
  }
});

export async function getPageBySlug(slug: string, locale: string) {
  return getPageBySlugCached(slug, locale);
}

export async function getAboutPage(locale: string) {
  return getPageBySlug('about', locale);
}
