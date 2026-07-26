# @trungtmnguyen/analytics

Small browser analytics helpers for Google Analytics and Umami.

## Setup

Render the analytics component once in the application shell using the existing public provider
credentials:

```tsx
<Analytics
  googleAnalyticsId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
  umamiScriptUrl={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
  umamiWebsiteId={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
/>
```

A provider is enabled only when its required values are present.

## Page views

- Google Analytics automatic page views are disabled with `send_page_view: false`. A small App
  Router tracker sends one page view for the initial route and each changed pathname or allowed
  search parameter.
- Umami uses its official automatic SPA tracking. The application does not manually send Umami
  page views.

## Custom events

`trackEvent` safely calls both available browser APIs. Calls made during SSR or before a provider
script has loaded are no-ops.

```ts
trackEvent(AnalyticsEventNames.selectBlogTag, {
  locale: 'en',
  tag: 'java',
});
```
