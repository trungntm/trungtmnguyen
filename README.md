# Trung Nguyen Blog Monorepo

Phase 1 establishes the blog infrastructure only: monorepo tooling, App Router baseline, theming, SEO defaults, and developer experience. It intentionally does not include blog content logic, MDX rendering, or tests yet.

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

## Decisions

- The repo uses a `pnpm` workspace plus Turborepo so the app can grow into additional packages without restructuring.
- ESLint uses the flat config model and the ESLint CLI directly because Next.js `16` removed the old `next lint` workflow.
- Tailwind CSS `v4` is configured through `@import 'tailwindcss'` and CSS variable tokens in `globals.css`, which keeps the custom palette centralized and theme-aware.
- `next-themes` drives light/dark mode using a class on `<html>` so design tokens and browser color-scheme stay aligned.
- The typography baseline uses local font stacks instead of remote font fetching so production builds remain deterministic in restricted or offline environments.
- SEO defaults live in `apps/web/lib/seo.ts` and feed root metadata, canonical URLs, Open Graph, Twitter cards, `sitemap.ts`, and `robots.ts`.

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
