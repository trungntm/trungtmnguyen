# @trungtmnguyen/analytics

Small, typed, provider-agnostic analytics for the public blog monorepo.

## Purpose

- Keep blog feature code vendor-neutral.
- Support multiple analytics providers at the same time.
- Keep analytics safe as a no-op when no providers are configured.
- Keep Next.js App Router page views centralized and deduplicated.
- Leave room for future consent gating through `config.enabled`.

## Supported providers

- Google Analytics
- Umami

Unknown providers are not supported automatically from an ID alone. Every provider needs:

- A provider config type
- An adapter implementation
- An optional script renderer
- Registration in `createAnalyticsAdapter`

## Exports

```ts
import { trackEvent } from '@trungtmnguyen/analytics/client';
import { AnalyticsProvider } from '@trungtmnguyen/analytics/next';
```

The package root also re-exports the public API.

## Generic API

```ts
import { AnalyticsEventNames } from '@trungtmnguyen/analytics';
import { trackEvent } from '@trungtmnguyen/analytics/client';

trackPageView({
  path: '/en/blog/example?ref=series',
  location: 'https://trungtmnguyen.com/en/blog/example?ref=series',
  title: 'Example',
  referrer: 'https://google.com',
});

trackEvent(AnalyticsEventNames.selectBlogTag, {
  tag: 'java',
  locale: 'en',
});
```

## Configuration

```ts
import type { AnalyticsConfig } from '@trungtmnguyen/analytics';

const analyticsConfig: AnalyticsConfig = {
  providers: [
    {
      provider: 'google-analytics',
      measurementId: 'G-XXXXXXXXXX',
    },
    {
      provider: 'umami',
      websiteId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      scriptUrl: 'https://analytics.example.com/script.js',
    },
  ],
};
```

### Google Analytics only

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Umami only

```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.example.com/script.js
```

### Multiple providers

```tsx
<AnalyticsProvider config={analyticsConfig}>{children}</AnalyticsProvider>
```

## Next.js behavior

- `AnalyticsProvider` stays server-safe.
- A small client runtime registers adapters and renders one shared page-view tracker.
- Provider scripts stay inside the package.
- Page views are deduplicated by normalized path so Strict Mode rerenders do not double count.
- Only known-safe search params are included in tracked page URLs: `tag`, `ref`, `page`.

## Google Analytics notes

- Loads `gtag.js` only when a measurement ID exists.
- Initializes with `send_page_view: false`.
- Expects explicit page views from the shared App Router tracker.
- Converts camelCase event payloads to snake_case before dispatch.

## Umami notes

- Loads the configured script URL with `data-website-id`.
- Uses `data-auto-track="false"` so page views come from the shared tracker.
- Sends page views and custom events through `window.umami.track(...)`.

## Consent behavior

This package does not implement a cookie banner. If the application has analytics consent state, pass:

```ts
{
  enabled: hasAnalyticsConsent,
  providers: [...]
}
```

When `enabled === false`, the package renders no scripts and dispatch becomes a no-op.

## SSR and no-op behavior

- Importing types or config on the server is safe.
- Browser globals are accessed only inside adapters or client components.
- If no valid providers are configured, scripts do not render and tracking calls safely do nothing.

## Adding a typed event

Update `src/types/analytics-events.ts`:

```ts
export type AnalyticsEventParameters = {
  select_blog_tag: {
    tag: string;
    locale: string;
  };
};
```

The event name union is derived automatically from the map keys.

## Adding a future provider

1. Add a provider config type to `src/types/analytics-config.ts`.
2. Implement `AnalyticsAdapter`.
3. Add an optional script renderer.
4. Register the provider in `createAnalyticsAdapter`.
5. Pass the new config from the application.
