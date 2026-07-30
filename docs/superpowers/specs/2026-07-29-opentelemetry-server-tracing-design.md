# OpenTelemetry Server Tracing Design

## Goal

Enable automatic server-side tracing for the `@apps/web` Next.js application and export traces
directly to Grafana Cloud over OTLP using Grafana-generated environment values.

## Scope

This phase covers automatic Next.js server tracing only. It does not add browser tracing, manual
spans, metrics, logs, collectors, dashboards, alerts, deployment configuration, infrastructure
changes, or Grafana Cloud resources.

Existing Google Analytics, Umami, Vercel Analytics, and Vercel Speed Insights integrations remain
unchanged because they serve product analytics and performance-insight concerns separate from
server-side application tracing.

## Repository Context

- The application package is `apps/web`.
- It uses Next.js `16.2.9` and the App Router under `apps/web/app`.
- The workspace uses pnpm `10.22.0`.
- The application does not use an `apps/web/src` layout.
- No instrumentation file or OpenTelemetry registration currently exists.
- No application route explicitly selects the Edge runtime.

## Architecture

The application will use the official Next.js OpenTelemetry integration:

```text
Next.js server runtime
  -> @vercel/otel
  -> Grafana Cloud OTLP endpoint
```

`apps/web/instrumentation.ts` will export Next.js's conventional `register` function and call
`registerOTel` exactly once. The service name will resolve from `process.env.OTEL_SERVICE_NAME`,
falling back to `trungtmnguyen-blog`.

No runtime guard is required. The official integration supports Next.js instrumentation in Node.js
and Edge runtimes, while the current application has no route explicitly configured for Edge.
Avoiding a guard is the smallest implementation and prevents accidentally excluding a runtime.

## Dependencies

Add `@vercel/otel` to the web application's production dependencies. Add only the OpenTelemetry API
peer packages required by the resolved official package version. Inspect the installed package
metadata and declarations before finalizing the instrumentation syntax.

Do not install or configure a separate OpenTelemetry SDK, tracer provider, exporter instance, or
collector. Environment-based OTLP auto-configuration remains owned by `@vercel/otel`.

## Environment Configuration

Create `apps/web/.env.example` with placeholders for:

```dotenv
OTEL_SERVICE_NAME=trungtmnguyen-blog
OTEL_EXPORTER_OTLP_ENDPOINT=https://<grafana-cloud-otlp-endpoint>
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Basic <redacted>
```

The documentation will state that the endpoint and headers come from the Grafana Cloud
OpenTelemetry setup wizard, the headers value is secret, and all three variables are server-only.
It will prohibit `NEXT_PUBLIC_` prefixes, direct users to put real local values in
`apps/web/.env.local`, state that the file must not be committed, and require restarting the
development server after changes.

No protocol, resource-attribute, or traces-specific endpoint variable will be added unless the
resolved exporter demonstrably requires it.

## Safe Behavior

Absent OTLP variables must not cause installation, type checking, linting, building, or local
startup to fail. The instrumentation fallback always provides
`service.name=trungtmnguyen-blog`, while exporter configuration remains optional and
environment-driven.

No environment value will be imported into client components, exposed with a `NEXT_PUBLIC_`
prefix, or logged. Existing analytics source files will not be modified.

## Verification

The implementation will be checked by:

1. Installing with the existing pnpm workspace configuration.
2. Inspecting the resolved `@vercel/otel` metadata and TypeScript declarations.
3. Running formatting checks, lint, type checking, and a production build without OTLP variables.
4. Confirming the instrumentation location, single registration, service-name fallback, and absence
   of client exposure or real credentials in the Git diff.
5. Starting the development server and requesting server-rendered routes and available Route
   Handlers.
6. Checking Grafana Cloud only if real values are independently available in
   `apps/web/.env.local`.

Grafana receipt will not be claimed unless traces are visibly confirmed in Grafana Cloud. If real
credentials are unavailable, local initialization and traffic generation will be reported
separately from backend receipt.
