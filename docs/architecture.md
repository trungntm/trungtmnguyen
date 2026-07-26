# Architecture

> For coding conventions, scope control, and verification policy see
> [`AGENTS.md`](../AGENTS.md). Source code is the final source of truth.

## 1. Purpose

This repository produces **trungtmnguyen.com**, a production personal engineering
blog. It is a read-oriented public site — all blog content is managed by an
external CMS and served through the CMS public API.

## 2. System Overview

The repository is a **pnpm workspace managed by Turborepo**. It contains a single
deployable application and a set of internal packages that encapsulate reusable
subsystems.

```
┌──────────────────────────────────────────────────┐
│                    Vercel                         │
│  ┌────────────────────────────────────────────┐  │
│  │             @apps/web (Next.js)            │  │
│  │  app/ · components/ · features/ · lib/     │  │
│  └──────┬──────┬──────┬──────┬────────────────┘  │
│         │      │      │      │                   │
│    analytics  blog-   search  ui                 │
│              comments                            │
└──────────────────────────────────────────────────┘
         │        │
         ▼        ▼
   ┌─────────────────┐
   │  External CMS    │
   │  (CMS_BASE_URL)  │
   └─────────────────┘
```

The application is deployed to **Vercel**. Blog content and comments are served by
an external CMS accessed at runtime.

## 3. Repository and Module Ownership

### Application — [`apps/web/`](../apps/web)

The Next.js application. Owns routes, layouts, server-side data access, page
orchestration, and all application-specific behavior.

| Directory                               | Responsibility                                                  |
| --------------------------------------- | --------------------------------------------------------------- |
| [`app/`](../apps/web/app)               | Routes, layouts, metadata, API route handlers, error boundaries |
| [`components/`](../apps/web/components) | Application-level React components                              |
| [`features/`](../apps/web/features)     | Feature modules: CMS integration, OG images, redirects          |
| [`lib/`](../apps/web/lib)               | Shared helpers: i18n, SEO, blog data, GitHub integration        |
| [`data/`](../apps/web/data)             | Local MDX content (about page, per locale)                      |
| [`locales/`](../apps/web/locales)       | Translation dictionaries (vi, en)                               |

### Packages — [`packages/`](../packages)

Each package represents a genuinely reusable subsystem.

| Package                                                     | Responsibility                                                  |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| [`@trungtmnguyen/analytics`](../packages/analytics)         | Analytics script injection and type-safe event tracking         |
| [`@trungtmnguyen/blog-comments`](../packages/blog-comments) | Comment system: API client, UI components, hooks, validation    |
| [`@trungtmnguyen/search`](../packages/search)               | Full-text search indexing and hydration (MiniSearch)            |
| [`@trungtmnguyen/ui`](../packages/ui)                       | Shared UI primitives and GitHub contribution calendar           |
| [`@trungtmnguyen/config`](../packages/config)               | Shared ESLint and TypeScript configuration (no runtime exports) |

## 4. Dependency Boundaries

```
@apps/web
  ├── @trungtmnguyen/analytics
  ├── @trungtmnguyen/blog-comments ──▸ @trungtmnguyen/ui
  ├── @trungtmnguyen/search
  └── @trungtmnguyen/ui
```

**Rules**:

- All dependency edges flow **from the application toward packages**.
- Packages must not import from `apps/web`.
- Currently, `blog-comments → ui` is the only inter-package dependency.
- Packages use `workspace:*` protocol and are transpiled by Next.js.

## 5. Major Data Flows

### Blog content

The CMS is the single source of blog data. The application fetches posts and
series **server-side** through a dedicated CMS API client in
[`features/cms-blog/`](../apps/web/features/cms-blog). All CMS responses are
validated at the integration boundary and mapped into application view models
before reaching route pages.

### Search

The search index is **built server-side** from CMS content and served as
serialized JSON through API route handlers. Clients fetch and hydrate the index
at runtime — there is no server-side query endpoint. The
[`@trungtmnguyen/search`](../packages/search) package owns index creation and
hydration; the application owns the API routes and client-side integration.

### Comments

The [`@trungtmnguyen/blog-comments`](../packages/blog-comments) package handles
comments end-to-end. It communicates directly with the CMS backend API. The
application provides configuration and renders the comment components.
Bot protection uses Cloudflare Turnstile.

### Local content

The about page is the only content stored locally, as MDX files in
[`data/pages/`](../apps/web/data/pages) (one per locale). All other content
comes from the CMS.

### GitHub contributions

The application queries the GitHub GraphQL API server-side for contribution
calendar data, rendered by a component from
[`@trungtmnguyen/ui`](../packages/ui).

## 6. Data Ownership

| Data                     | Owner                    | Access pattern                              |
| ------------------------ | ------------------------ | ------------------------------------------- |
| Blog posts, series, tags | External CMS             | Server-side fetch via CMS API client        |
| Comments, reactions      | External CMS             | Client-side fetch via blog-comments package |
| Search index             | Derived from CMS content | Server-built, client-hydrated               |
| About page               | Local MDX files          | Server-side file read                       |
| Translations             | Local JSON dictionaries  | Synchronous import                          |
| GitHub contributions     | GitHub GraphQL API       | Server-side fetch with revalidation         |
| Redirects                | External CMS             | Build-time fetch                            |

## 7. Where New Code Belongs

| Change type                          | Location                                                           |
| ------------------------------------ | ------------------------------------------------------------------ |
| Route, page, or layout               | [`apps/web/app/`](../apps/web/app)                                 |
| Application-specific component       | [`apps/web/components/`](../apps/web/components)                   |
| CMS integration or blog data access  | [`apps/web/features/cms-blog/`](../apps/web/features/cms-blog)     |
| Application helper (i18n, SEO, data) | [`apps/web/lib/`](../apps/web/lib)                                 |
| OpenGraph image generation           | [`apps/web/features/open-graph/`](../apps/web/features/open-graph) |
| Redirect rules                       | [`apps/web/features/redirects/`](../apps/web/features/redirects)   |
| Shared UI primitive                  | [`packages/ui/`](../packages/ui)                                   |
| Comment behavior                     | [`packages/blog-comments/`](../packages/blog-comments)             |
| Analytics provider or event type     | [`packages/analytics/`](../packages/analytics)                     |
| Search indexing or hydration         | [`packages/search/`](../packages/search)                           |
| Translation text                     | [`apps/web/locales/`](../apps/web/locales)                         |
| Local static page content            | [`apps/web/data/pages/`](../apps/web/data/pages)                   |
| ESLint or TypeScript config          | [`packages/config/`](../packages/config)                           |

**Do not** create a new package unless the functionality has a genuine
cross-workspace consumer or represents an intentionally isolated subsystem.
Keep application-specific behavior inside `apps/web`.

## 8. Architecture Principles

These principles are demonstrated by the existing implementation and documented
in [`AGENTS.md`](../AGENTS.md).

1. **Application composes packages** — the application imports from internal
   packages; packages never import from the application.
2. **CMS is the source of truth** — blog content is never persisted locally.
   The application is a read-oriented consumer of the CMS API.
3. **Validate at integration boundaries** — all external responses (CMS,
   GitHub) are validated with Zod before entering the application.
4. **Server Components by default** — server-side data access uses Server
   Components and `server-only` imports. Client boundaries are introduced only
   when browser interaction is required.
5. **Locale is a URL segment** — locale is determined from the URL path, not
   cookies or headers. Switching locale changes the URL.
6. **Extend before abstracting** — existing patterns should be extended before
   introducing new abstractions. New packages or layers require a concrete
   justification.
7. **Simple and explicit** — prefer straightforward, readable code. Avoid
   unnecessary indirection, speculative generalization, or parallel
   implementations.

## 9. Major Constraints

1. **No direct database access** — the application has no database of its
   own. All data is read from the CMS API. Mutable operations (comments,
   reactions, reports) are written through the CMS API.
2. **Dependency direction is application → packages** — never the reverse.
3. **Minimal cross-package dependencies** — currently limited to
   `blog-comments → ui`.
4. **Search index is prebuilt server-side** — clients fetch a serialized index;
   there is no server-side search query endpoint.
5. **Localization is dictionary-based** — user-facing text uses JSON
   translation dictionaries. Do not hardcode strings in localized features.
6. **Security headers are applied globally** — CSP, HSTS, and related headers
   are configured in the Next.js config.

## 10. Change Guidance

1. **Find the existing pattern** — inspect the current implementation before
   introducing new approaches.
2. **Use CodeGraph for impact analysis** — especially for cross-package or
   shared-contract changes.
3. **Preserve dependency direction** — application → packages only.
4. **Extend the current owner** — add to the existing module rather than
   creating parallel implementations.
5. **Check all consumers** before changing shared types, schemas, or contracts.
6. **Keep changes localized** — do not refactor unrelated code.
7. **Update this document** only when responsibilities, boundaries, or major
   data flows change.

For detailed coding conventions, scope control, verification requirements,
and definition of done, see [`AGENTS.md`](../AGENTS.md).

## 11. Related Documentation

| Document                                                | Purpose                                                        |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| [`AGENTS.md`](../AGENTS.md)                             | Engineering conventions, workflow, scope control, verification |
| [`turbo.json`](../turbo.json)                           | Turborepo task graph and environment variables                 |
| [`apps/web/next.config.ts`](../apps/web/next.config.ts) | Next.js configuration, security headers, transpiled packages   |
