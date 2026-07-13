# Trung Nguyen Blog Monorepo

The public blog is CMS-backed. `/blog`, localized blog routes, localized series routes, sitemap, RSS, homepage blog sections, and search all read from the public CMS API. The `/about` page remains local MDX loaded at runtime.

## Stack

- Next.js `16.2.9`
- React `19.2.7`
- React DOM `19.2.7`
- TypeScript `6.0.3`
- ESLint `9.39.4`
- `eslint-config-next` `16.2.9`
- Prettier `3.8.3`
- Turborepo `2.10.0`
- Tailwind CSS `4.2.4`
- `@tailwindcss/postcss` `4.3.1`
- `next-themes` `0.4.6`
- `clsx` `2.1.1`
- `tailwind-merge` `3.6.0`
- `class-variance-authority` `0.7.1`
- `lucide-react` `1.14.0`
- `framer-motion` `12.42.0`
- `kbar` `0.1.0-beta.48`
- `minisearch` `7.2.0`
- `@mdx-js/mdx` `3.1.1`
- `gray-matter` `4.0.3`
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
- Public blog content is loaded from `CMS_BASE_URL` through the CMS public API.
- CMS tag pages, sitemap entries, RSS, and search payloads are derived from the CMS post list at runtime.
- CMS blog series are loaded through the same `CMS_BASE_URL` server-side client with Zod validation, 60 second revalidation, and localized metadata.
- The About page is loaded from `apps/web/data/pages/about.mdx` through `apps/web/lib/pages.ts`.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm format
```

## Search

Search uses `kbar` for the command palette UI and `MiniSearch` for ranking and query matching. The shared search core lives in `packages/search`, while the web app keeps all kbar and UI-specific code under `apps/web/components/search`.

Kbar blog search reads published CMS posts through server routes:

- `/api/search/index`
- `/api/search/docs`

Those routes fetch the public CMS blog API on the server, build a MiniSearch index, and return cached JSON payloads for the client palette. Static navigation actions remain local to the app.

Current cache strategy for the CMS-backed search routes is:

```text
Cache-Control: public, s-maxage=60, stale-while-revalidate=86400
```

Search payloads are also preloaded with `requestIdleCallback` and fall back to `setTimeout` when needed. That preload runs only once, improves the first search-open latency, and does not block the initial page render.

Desktop keeps the centered command palette. Mobile uses a bottom-sheet style search popup so the input stays visible while results scroll inside the sheet.

## Git Hooks

Husky `9.1.7` is configured at the repo root and delegates `pre-commit` to `lint-staged` `16.4.0`.

Current staged-file checks:

- `*.{js,jsx,ts,tsx,mjs,cjs}`: `pnpm exec eslint --fix`
- `*.{json,md,css}`: `pnpm exec prettier --write`

## Environment

Set `CMS_BASE_URL` for the public CMS blog API consumed by `apps/web`. This value is server-only.

Set `NEXT_PUBLIC_SITE_URL` for canonical URLs, sitemap, robots output, RSS, and CMS blog structured data in non-local environments.
Set analytics env vars in the web app only when you want to enable provider-specific analytics:

- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL`

Required CMS blog env vars:

```text
CMS_BASE_URL=
NEXT_PUBLIC_SITE_URL=
```

Optional analytics env vars:

```text
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_SCRIPT_URL=
```

Set `GITHUB_TOKEN` to enable the GitHub contribution calendar on `/about`. The token is used only on the server for GitHub GraphQL requests and is never exposed to the client.

## Tags

Tags are derived from CMS post tags and normalized into stable URL slugs before they are exposed publicly.

Public tag routes:

- `/tags`
- `/tags/[tag]`

Notes:

- Tag slugs are derived from the original label and normalized to lowercase URL-safe values.
- The UI preserves the original display label while route matching uses the normalized slug.

## Series

Series are served from the CMS public API and exposed through localized App Router pages:

- `/vi/series`
- `/en/series`
- `/vi/series/[slug]`
- `/en/series/[slug]`

CMS endpoints used by the web app:

- `GET /api/public/blog/series?locale={vi|en}&page={n}&pageSize={n}`
- `GET /api/public/blog/series/:locale/:slug`

Notes:

- All CMS requests use `process.env.CMS_BASE_URL` through `apps/web/features/cms-blog/api/cms-blog-api.ts`.
- Series list pages support `?page=` and fall back to page `1` when the query is missing or invalid.
- Series detail metadata uses the CMS-provided canonical `url` and alternate locale URLs from `translations`.
- The language switcher uses series translation URLs directly on series detail pages instead of assuming shared slugs.
- Sitemap generation includes localized series index pages and every published series detail URL by paging through the CMS list API.
- Series fetches follow the existing CMS cache strategy with `next.revalidate = 60`.

## Table of Contents

Blog detail pages generate a table of contents from CMS markdown `h2` and `h3` headings.

Notes:

- TOC items are extracted at runtime from CMS markdown content.
- Headings inside fenced code blocks are ignored.
- Heading ids are linked through `rehype-slug` and `rehype-autolink-headings`.
- The TOC appears on blog detail pages and links to the rendered heading anchors.

## Editing the About Page

The `/about` route is powered by a local MDX file. Edit this file:

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
