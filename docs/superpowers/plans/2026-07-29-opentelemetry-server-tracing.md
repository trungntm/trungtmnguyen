# OpenTelemetry Server Tracing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable automatic Next.js server-side tracing from `@apps/web` to a Grafana Cloud OTLP
endpoint while keeping OTLP configuration optional and server-only.

**Architecture:** Next.js loads a single application-root instrumentation file, which registers the
official `@vercel/otel` integration. The integration reads Grafana-generated standard OTLP
environment variables and assigns the service name from `OTEL_SERVICE_NAME`, with
`trungtmnguyen-blog` as the fallback.

**Tech Stack:** Next.js 16.2.9, TypeScript, pnpm 10.22.0, `@vercel/otel`, OpenTelemetry API peer
packages, Grafana Cloud OTLP

## Global Constraints

- Do not deploy or modify Vercel, Terraform, Terragrunt, or Grafana Cloud resources.
- Add automatic server-side traces only: no client tracing, manual spans, metrics, or log export.
- Register OpenTelemetry exactly once with the official `@vercel/otel` integration.
- Keep existing Google Analytics, Umami, Vercel Analytics, and Speed Insights code unchanged.
- Use `OTEL_SERVICE_NAME`, `OTEL_EXPORTER_OTLP_ENDPOINT`, and `OTEL_EXPORTER_OTLP_HEADERS`; do not
  add `NEXT_PUBLIC_` variants.
- Default `service.name` to `trungtmnguyen-blog`.
- Never commit or print Grafana credentials.
- The application must build and start without Grafana OTLP variables.

---

### Task 1: Install the official OpenTelemetry integration

**Files:**

- Modify: `apps/web/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: pnpm workspace package `@apps/web` and Next.js `16.2.9`
- Produces: production imports for `registerOTel` and its required OpenTelemetry API peers

- [ ] **Step 1: Inspect the current dependency graph**

Run:

```bash
pnpm list --filter @apps/web --depth 4 '@vercel/otel' '@opentelemetry/*' next
```

Expected: Next.js `16.2.9` is present; `@vercel/otel` is absent; no application-level
OpenTelemetry SDK/provider registration exists.

- [ ] **Step 2: Add the official packages to the web application**

Run:

```bash
pnpm --filter @apps/web add @vercel/otel @opentelemetry/api @opentelemetry/api-logs
```

Expected: pnpm updates only `apps/web/package.json` and `pnpm-lock.yaml`, aside from ignored package
manager state. The API packages satisfy the official `@vercel/otel` installation requirements and
do not configure OTLP log export.

- [ ] **Step 3: Inspect resolved metadata and declarations**

Run:

```bash
pnpm list --filter @apps/web --depth 2 '@vercel/otel' '@opentelemetry/api' \
  '@opentelemetry/api-logs'
pnpm --filter @apps/web exec node -p \
  "require('./node_modules/@vercel/otel/package.json').version"
rg -n "registerOTel|serviceName" apps/web/node_modules/@vercel/otel -g '*.d.ts'
```

Expected: one resolved `@vercel/otel` version, compatible peer versions, and a declaration that
accepts either a service-name string or a configuration object containing `serviceName`.

- [ ] **Step 4: Review the dependency-only diff**

Run:

```bash
git diff -- apps/web/package.json pnpm-lock.yaml
```

Expected: only the three required direct dependencies and their resolved transitive dependency
graph are added; Next.js and unrelated dependencies are not upgraded.

### Task 2: Register tracing and document server-only OTLP variables

**Files:**

- Create: `apps/web/instrumentation.ts`
- Create: `apps/web/.env.example`

**Interfaces:**

- Consumes: `registerOTel` from `@vercel/otel` and optional
  `process.env.OTEL_SERVICE_NAME`
- Produces: `register(): void`, called once by Next.js when a server instance starts

- [ ] **Step 1: Add the application-root instrumentation file**

Create `apps/web/instrumentation.ts` with:

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME ?? 'trungtmnguyen-blog',
  });
}
```

Do not add client directives, runtime-specific imports, custom exporters, providers, processors,
manual spans, or a second registration path.

- [ ] **Step 2: Add the environment example**

Create `apps/web/.env.example` with:

```dotenv
# Server-only OpenTelemetry configuration.
# Copy the real local values into .env.local. Never commit .env.local.
# Restart the development server after changing these values.
#
# OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OTLP_HEADERS come from the
# Grafana Cloud OpenTelemetry setup wizard. OTEL_EXPORTER_OTLP_HEADERS is secret.
# These variables are server-only and must never use the NEXT_PUBLIC_ prefix.
OTEL_SERVICE_NAME=trungtmnguyen-blog
OTEL_EXPORTER_OTLP_ENDPOINT=https://<grafana-cloud-otlp-endpoint>
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Basic <redacted>
```

- [ ] **Step 3: Format the new files**

Run:

```bash
pnpm exec prettier --write apps/web/instrumentation.ts apps/web/.env.example
```

Expected: Prettier reports both files formatted without changing unrelated files.

- [ ] **Step 4: Perform focused static safety checks**

Run:

```bash
test -f apps/web/instrumentation.ts
test ! -e apps/web/src/instrumentation.ts
test "$(rg -l 'registerOTel\\(' apps/web packages | wc -l | tr -d ' ')" = "1"
test "$(rg -n 'NEXT_PUBLIC_OTEL|NEXT_PUBLIC_.*OTEL' apps/web packages | wc -l | tr -d ' ')" = "0"
rg -n "OTEL_SERVICE_NAME|trungtmnguyen-blog|registerOTel" apps/web/instrumentation.ts
```

Expected: instrumentation exists only at the application root, one file contains registration,
there are no public OTEL variables, and the service-name fallback is visible.

### Task 3: Validate builds and local runtime behavior

**Files:**

- Verify: `apps/web/instrumentation.ts`
- Verify: `apps/web/.env.example`
- Verify: `apps/web/package.json`
- Verify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: completed dependency and instrumentation changes
- Produces: verification evidence and local trace-generating HTTP traffic

- [ ] **Step 1: Verify installation consistency**

Run:

```bash
pnpm install --frozen-lockfile
```

Expected: exit code `0`, with no lockfile changes.

- [ ] **Step 2: Run repository formatting checks**

Run:

```bash
pnpm format:check
```

Expected: exit code `0`.

- [ ] **Step 3: Run repository lint**

Run:

```bash
pnpm lint
```

Expected: exit code `0`.

- [ ] **Step 4: Run repository type checking**

Run:

```bash
pnpm typecheck
```

Expected: exit code `0`.

- [ ] **Step 5: Build without OTLP variables**

Ensure no `apps/web/.env.local` file containing OTLP variables is present, then run:

```bash
env -u OTEL_SERVICE_NAME -u OTEL_EXPORTER_OTLP_ENDPOINT -u OTEL_EXPORTER_OTLP_HEADERS pnpm build
```

Expected: exit code `0`, proving missing Grafana configuration does not crash the production
build.

- [ ] **Step 6: Start the development server without OTLP variables**

Run:

```bash
env -u OTEL_SERVICE_NAME -u OTEL_EXPORTER_OTLP_ENDPOINT -u OTEL_EXPORTER_OTLP_HEADERS \
  pnpm --filter @apps/web dev
```

Expected: Next.js reports a ready local server and does not emit an instrumentation startup error.

- [ ] **Step 7: Generate server-side traffic**

Request server-rendered routes and Route Handlers without printing environment variables:

```bash
curl --fail --silent --output /dev/null http://localhost:3000/
curl --fail --silent --output /dev/null http://localhost:3000/en
curl --fail --silent --output /dev/null http://localhost:3000/about
curl --fail --silent --output /dev/null http://localhost:3000/rss.xml
curl --fail --silent --output /dev/null http://localhost:3000/api/search/index
curl --fail --silent --output /dev/null http://localhost:3000/api/search/docs
```

Expected: requests exercise Next.js rendering and available server Route Handlers. Report any
route that cannot succeed because its external CMS configuration or data is unavailable.

- [ ] **Step 8: Check whether real Grafana values are available safely**

Check only presence, never values:

```bash
test -f apps/web/.env.local
```

If the file exists, verify the three variable names without printing their values, restart the
development server, repeat Step 7, wait up to five minutes, and inspect Grafana Cloud for
`service.name = "trungtmnguyen-blog"`. If the file does not exist, do not create fake credentials
and report Grafana receipt as unverified.

- [ ] **Step 9: Audit the final diff and scope**

Run:

```bash
git diff --check
git status --short
git diff -- apps/web/package.json apps/web/instrumentation.ts apps/web/.env.example pnpm-lock.yaml
git diff --name-only
rg -n "OTEL_EXPORTER_OTLP_HEADERS|Authorization=Basic" \
  apps/web/instrumentation.ts apps/web/.env.example apps/web/package.json
```

Expected: the implementation diff is limited to the dependency files, instrumentation, and
placeholder environment documentation; no real credential, client OTEL variable, analytics file,
Vercel configuration, or infrastructure file appears.
