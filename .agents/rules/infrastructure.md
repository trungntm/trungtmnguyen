---
description: Supplemental guidance for shared packages, CMS integrations, and infrastructure.
trigger: glob
paths:
  - 'packages/analytics/**'
  - 'packages/blog-comments/**'
  - 'packages/search/**'
  - 'packages/config/**'
  - 'apps/web/features/cms-blog/**'
  - 'apps/web/lib/**'
---

Apply this rule when modifying:

- shared packages under `packages/`;
- CMS integration in `apps/web/features/cms-blog/`;
- shared application helpers in `apps/web/lib/`.

Follow all repository-wide instructions in `AGENTS.md`.

Additional infrastructure guidance:

- Shared packages are consumed by `apps/web`. Verify consumers after contract changes.
- Do not introduce breaking changes to package exports without updating all call sites.
- Preserve the existing CMS data access flow; do not bypass repositories or API clients.
- Follow the verification escalation in `AGENTS.md` section 10 for shared package changes.
- Do not add new packages without an explicit requirement and a genuine cross-workspace consumer.
