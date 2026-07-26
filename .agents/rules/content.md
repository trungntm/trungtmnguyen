---
description: Supplemental guidance for MDX content, Markdown, and locale resources.
trigger: glob
paths:
  - 'apps/web/data/**'
  - 'apps/web/locales/**'
  - '**/*.mdx'
  - '**/*.md'
---

Apply this rule when modifying:

- local MDX or Markdown content;
- blog metadata;
- locale resources;
- article rendering behavior.

Follow all repository-wide instructions in `AGENTS.md`.

Additional content guidance:

- Preserve valid raw Markdown and MDX syntax.
- Do not wrap an entire article in an additional code fence.
- Keep Vietnamese and English content structurally aligned when both locales exist.
- Preserve existing front matter fields and naming conventions.
- Do not invent factual technical claims.
- Keep the writing practical, engineering-focused, and free from marketing language.
