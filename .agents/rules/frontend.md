---
description: Supplemental guidance for frontend components, routes, and UI packages.
trigger: glob
paths:
  - 'apps/web/app/**'
  - 'apps/web/components/**'
  - 'apps/web/features/**'
  - 'packages/ui/**'
---

Apply this rule when modifying:

- `apps/web/app/**`;
- `apps/web/components/**`;
- `apps/web/features/**`;
- `packages/ui/**`.

Follow all repository-wide instructions in `AGENTS.md`.

Additional frontend guidance:

- Inspect nearby components before introducing a new UI pattern.
- Preserve the existing editorial and content-focused visual language.
- Prefer Server Components unless client-side behavior is required.
- Avoid unnecessary state, effects, and client boundaries.
- Preserve responsive layouts, light mode, dark mode, and accessibility.
- Add translations for user-facing text using the existing locale system.
- Do not introduce a new component abstraction for a one-off local use case.
