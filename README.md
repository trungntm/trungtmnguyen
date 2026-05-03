# Trung Nguyen Blog Monorepo

Phase 3 adds an MDX-powered About page on top of the existing typed blog pipeline. The project now uses Content Collections for both local blog posts and structured site pages, including `/about`, while preserving the existing App Router and MDX rendering flow.

## Stack

- Next.js `16.2.4`
- React `19.2.5`
- React DOM `19.2.5`
- TypeScript `6.0.3`
- ESLint `9.39.4`
- `eslint-config-next` `16.2.4`
- Prettier `3.8.3`
- Turborepo `2.9.6`
- Tailwind CSS `4.2.4`
- `@tailwindcss/postcss` `4.2.4`
- `next-themes` `0.4.6`
- `clsx` `2.1.1`
- `tailwind-merge` `3.5.0`
- `class-variance-authority` `0.7.1`
- `lucide-react` `1.14.0`
- `@content-collections/core` `0.15.0`
- `@content-collections/mdx` `0.2.2`
- `@content-collections/next` `0.2.11`
- `zod` `4.4.1`
- `reading-time` `1.5.0`
- `remark-gfm` `4.0.1`
- `rehype-slug` `6.0.0`
- `rehype-autolink-headings` `7.1.0`
- `rehype-pretty-code` `0.14.3`
- `shiki` `4.0.2`

## Decisions

- The repo uses a `pnpm` workspace plus Turborepo so the app can grow into additional packages without restructuring.
- ESLint uses the flat config model and the ESLint CLI directly because Next.js `16` removed the old `next lint` workflow.
- Tailwind CSS `v4` is configured through `@import 'tailwindcss'` and CSS variable tokens in `globals.css`, which keeps the custom palette centralized and theme-aware.
- `next-themes` drives light/dark mode using a class on `<html>` so design tokens and browser color-scheme stay aligned.
- The typography baseline uses local font stacks instead of remote font fetching so production builds remain deterministic in restricted or offline environments.
- SEO defaults live in `apps/web/lib/seo.ts` and feed root metadata, canonical URLs, Open Graph, Twitter cards, `sitemap.ts`, and `robots.ts`.
- Blog content lives under `apps/web/data/blogs` and page content lives under `apps/web/data/pages`, both compiled through `apps/web/content-collections.ts`.
- Draft filtering is centralized in `apps/web/lib/blogs.ts` so future `draftMode()` preview support can extend one path instead of every route.
- The About page is backed by the `pages` collection and loaded through `apps/web/lib/pages.ts`.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm format
```

## Git Hooks

Husky `9.1.7` is configured at the repo root and delegates `pre-commit` to `lint-staged` `16.4.0`.

Current staged-file checks:

- `*.{js,jsx,ts,tsx,mjs,cjs}`: `pnpm exec eslint --fix`
- `*.{json,md,css}`: `pnpm exec prettier --write`

## Environment

Set `NEXT_PUBLIC_SITE_URL` for canonical URLs, sitemap, and robots output in non-local environments.

## Writing Blog Posts

Create MDX files under `apps/web/data/blogs` using nested folders for route structure:

```text
apps/web/data/blogs/
  spring-modulith/module-boundaries.mdx
  nextjs/typed-mdx-blog.mdx
  devops/kubernetes-jvm-memory.mdx
```

Route mapping is folder-based:

- `apps/web/data/blogs/spring-modulith/module-boundaries.mdx` -> `/blog/spring-modulith/module-boundaries`
- `apps/web/data/blogs/nextjs/typed-mdx-blog.mdx` -> `/blog/nextjs/typed-mdx-blog`

### Frontmatter Schema

Required fields:

- `title`: non-empty string
- `description`: non-empty string
- `publishedAt`: ISO date string in `YYYY-MM-DD`
- `author`: non-empty string
- `tags`: string array
- `draft`: boolean

Optional fields:

- `updatedAt`: ISO date string in `YYYY-MM-DD`
- `thumbnail`: string path such as `/images/blogs/example-thumb.png`
- `cover`: string path such as `/images/blogs/example-cover.png`

Example:

```mdx
---
title: 'Designing Module Boundaries in Spring Modulith'
description: 'Practical rules for keeping Spring Modulith modules clean and maintainable.'
publishedAt: '2026-04-30'
updatedAt: '2026-04-30'
author: 'Trung Nguyen'
tags:
  - Spring Boot
  - Architecture
thumbnail: '/images/blogs/spring-modulith-thumb.png'
cover: '/images/blogs/spring-modulith-cover.png'
draft: false
---
```

### Publishing Rules

- Public `/blog` listing excludes `draft: true` posts.
- Draft posts are omitted from `sitemap.xml`.
- Direct draft URLs return `notFound()` unless future preview support enables draft access.
- Missing local thumbnail and cover files do not break the UI; those images are simply not rendered.

## Editing the About Page

The `/about` route is powered by the `pages` Content Collections collection. Edit this file:

```text
apps/web/data/pages/about.mdx
```

The frontmatter drives the structured sidebar and detail sections:

- hero copy: `title`, `headline`, `description`
- profile card: `name`, `role`, `company`, `location`, `email`, `phone`, `avatarText`, `socials`
- quick facts: `quickFacts`
- skills grid: `skills`
- activities: `activities`
- timelines: `education`, `career`
- language chips: `languages`

The MDX body renders the main narrative content on the right side of the About page using the same reusable MDX renderer as blog detail pages.
