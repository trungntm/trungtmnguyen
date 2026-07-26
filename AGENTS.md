# AGENTS.md — Engineering & Operational Guide

**Project:** trungtmnguyen.com  
**Purpose:** Production personal engineering blog  
**Workspace:** Monorepo managed by Turborepo and pnpm

The source code is the final source of truth. This document defines stable repository conventions and the expected workflow for coding agents.

## 1. Documentation

Read additional documentation only when it is relevant to the task.

- `docs/architecture.md` — Repository architecture, module ownership, dependency boundaries, data flow, and where new code belongs.
- Other documents under `docs/` may provide subsystem-specific guidance when applicable.

Treat these documents as architectural guidance.

If documentation conflicts with the current implementation, verify the source code before making changes and update the documentation if necessary.

## 2. AI Workflow and Context Discipline

Operate with a targeted, token-conscious workflow.

Do not perform repository-wide exploration, read large files, or load unrelated documentation without concrete justification.

### Repository exploration

Use CodeGraph before implementation when the task:

- has an unclear entry point;
- spans multiple files, packages, or application layers;
- changes a public API, shared DTO, contract, or schema;
- requires understanding callers, dependencies, or impact;
- introduces a feature that may already have a similar implementation.

Use CodeGraph to:

- locate likely entry points;
- inspect upstream and downstream dependencies;
- find callers and consumers;
- identify existing implementations of the same pattern;
- narrow the set of source files that must be inspected.

For a small, localized task with an explicit target file and limited impact, inspect the target file directly. Do not run broad CodeGraph exploration merely as a ritual.

CodeGraph is a navigation aid. Always inspect the relevant source code before making implementation decisions.

### Superpowers workflow

Use relevant Superpowers skills when they apply:

- `brainstorming` for design or behavior changes;
- `writing-plans` for multi-step implementation work;
- `systematic-debugging` for bugs and unexpected behavior;
- `test-driven-development` when suitable test infrastructure exists;
- `verification-before-completion` before claiming a task is complete.

Superpowers defines the development process. It does not replace CodeGraph, repository search, or direct source inspection.

### Precise reading

Read only the files and line ranges needed for the current task.

Expand the search scope only when the current evidence is insufficient.

Do not repeatedly read files that have already been inspected unless they have changed or new context requires it.

## 3. Repository Structure

This repository is a pnpm workspace managed with Turborepo.

### Main application

`apps/web` contains the primary Next.js application:

- `apps/web/app`: routes, layouts, route handlers, and metadata;
- `apps/web/components`: reusable application-level React components;
- `apps/web/features`: feature modules and CMS integrations;
- `apps/web/lib`: shared application helpers;
- `apps/web/data`: local MDX and static content data;
- `apps/web/locales`: localization resources;
- `apps/web/public`: static assets.

### Shared packages

`packages/*` contains shared workspace functionality such as:

- analytics;
- comments;
- search;
- UI primitives;
- ESLint and TypeScript configuration.

Keep application-specific behavior inside `apps/web`.

Promote code to a package only when it has a genuine cross-workspace consumer or represents an intentionally isolated reusable subsystem.

Do not create a package merely to make a small local implementation appear more architectural.

## 4. Architecture and Dependency Rules

Follow the repository's existing architectural boundaries.

The intended dependency direction is:

    Infrastructure and delivery layers -> Application -> Core

Rules:

- Core defines domain types, DTOs, contracts, and framework-independent validation.
- Core must not import Application or Infrastructure.
- Application depends on Core and contains use cases and business logic.
- Application must not import concrete Infrastructure implementations.
- Infrastructure implements contracts defined by Core or Application.
- UI components, route handlers, and framework adapters call application-level behavior instead of duplicating business rules.

CMS-backed data must be accessed through the existing CMS integration and application flow.

The public blog is read-oriented. Do not introduce direct database writes or bypass existing use cases, repositories, API clients, or validation layers.

Before creating a new implementation, search for an existing pattern and extend it where appropriate.

## 5. Development Philosophy

Prefer code that is:

- simple;
- explicit;
- readable;
- consistent with the surrounding implementation;
- easy to change or remove later.

Avoid unnecessary:

- abstractions;
- factories;
- wrappers;
- providers;
- generic utilities;
- configuration layers;
- environment variables;
- duplicated state;
- parallel implementations of existing features.

Do not generalize for hypothetical future requirements.

A new abstraction must solve a concrete problem in the current task and provide a clear advantage over following the existing pattern directly.

## 6. Scope Control

Modify only files required by the requested task.

Do not:

- refactor unrelated code;
- rename unrelated symbols;
- format unrelated files;
- replace working patterns merely because another approach is preferable;
- introduce broad architectural changes during a localized feature or bug fix.

When a larger refactor is genuinely required, explain why it is necessary and keep it separate from incidental cleanup.

## 7. UI and UX Principles

The visual language of the site is:

- premium;
- editorial;
- clean;
- minimal;
- modern;
- content-focused.

Favor:

- typography;
- whitespace;
- clear hierarchy;
- restrained borders and surfaces;
- subtle motion;
- responsive behavior;
- consistency with existing components.

Avoid:

- dashboard-style interfaces on editorial pages;
- excessive shadows or gradients;
- unnecessary animation;
- decorative elements without functional value;
- new visual patterns when an established component already exists.

For UI changes, inspect nearby components and preserve the existing theme, spacing system, responsive behavior, light mode, and dark mode.

## 8. Localization

The application supports multiple locales through the existing localization system in `apps/web/locales`.

Do not hardcode user-facing text when the surrounding feature is localized.

When introducing visible copy:

- add the appropriate translation keys;
- update all supported locales;
- preserve existing terminology and tone;
- verify that longer translated text does not break the layout.

Internal labels, developer-only diagnostics, and inaccessible implementation details do not require localization unless the existing pattern says otherwise.

## 9. Performance

Avoid unnecessary:

- React rerenders;
- client components;
- client-side state;
- network requests;
- CMS or database requests;
- sequential data fetching;
- large dependencies;
- duplicated analytics events;
- layout shifts;
- oversized images or bundles.

Prefer Server Components and server-side data access when consistent with the existing implementation.

Do not optimize speculatively. Preserve existing performance patterns and verify performance-sensitive changes where relevant.

## 10. Coding Style

Prettier is authoritative.

Use:

- TypeScript;
- two-space indentation;
- single quotes;
- semicolons;
- trailing commas;
- a 100-character print width;
- named exports unless the framework requires otherwise;
- `PascalCase` for React components and types;
- `camelCase` for functions and variables;
- kebab-case filenames;
- `_` prefixes for intentionally unused parameters.

Follow the shared ESLint and TypeScript configuration under `packages`.

Do not manually apply formatting conventions that conflict with the configured tools.

## 11. Commands and Verification

Run commands from the repository root unless a workspace-specific command is more appropriate.

Common commands:

    pnpm install
    pnpm dev
    pnpm typecheck
    pnpm lint
    pnpm format:check
    pnpm build

For application-only commands, confirm the actual package name from `apps/web/package.json` before using `pnpm --filter`.

Choose the smallest verification set that provides meaningful confidence.

### Localized copy or style change

- inspect the affected route or component;
- run formatting checks when needed;
- run targeted type checking when TypeScript code changed.

### UI or component behavior change

- run type checking;
- run linting for the affected workspace;
- manually verify the affected route;
- verify responsive behavior and both themes when relevant.

### Shared package or public contract change

- run type checking for affected consumers;
- run relevant tests if available;
- run linting;
- verify all known call sites.

### Architecture, dependency, routing, or configuration change

- run type checking;
- run linting;
- run formatting checks;
- run the relevant build.

Do not run an expensive repository-wide build for every trivial edit, but do not skip it when the change affects build configuration, shared packages, routing, or production behavior.

Never claim verification passed unless the command was actually run and its result was inspected.

## 12. Testing

Do not assume an automated test framework or repository-wide coverage requirement unless confirmed from the current source tree.

When tests exist, follow the existing location and naming conventions.

Do not introduce a new test framework for a small task without an explicit requirement.

For bug fixes, add or update a focused regression test when the affected area already has suitable test infrastructure.

## 13. Definition of Done

A task is complete only when:

- the requested behavior is implemented;
- relevant source code was inspected;
- existing patterns were reused where appropriate;
- architectural boundaries remain valid;
- no unrelated files were modified;
- user-facing text respects localization conventions;
- performance and accessibility were not knowingly degraded;
- the appropriate verification was run;
- command failures and unverified assumptions are reported honestly;
- the final diff does not introduce unnecessary complexity.
