export type AnalyticsEventParameters = {
  view_blog_post: { postId: string; slug: string; locale: string; title: string };
  select_blog_tag: { tag: string; locale: string };
  search_blog: { locale: string; queryLength: number; resultCount: number };
  change_locale: { fromLocale: string; toLocale: string; destinationPath: string };
  select_series: { seriesId: string; slug: string; locale: string };
  select_series_post: {
    seriesId: string;
    postId: string;
    slug: string;
    locale: string;
    position?: number;
  };
  share_blog_post: {
    postId: string;
    slug: string;
    locale: string;
    method: 'copy_link' | 'native_share';
  };
  copy_code: { slug: string; locale: string; language: string };
  click_external_link: { destinationHost: string; locale: string };
  create_comment: { postId: string; locale: string };
  reply_comment: { postId: string; locale: string };
};

export type AnalyticsEventName = keyof AnalyticsEventParameters;

export const AnalyticsEventNames = {
  viewBlogPost: 'view_blog_post',
  selectBlogTag: 'select_blog_tag',
  searchBlog: 'search_blog',
  changeLocale: 'change_locale',
  selectSeries: 'select_series',
  selectSeriesPost: 'select_series_post',
  shareBlogPost: 'share_blog_post',
  copyCode: 'copy_code',
  clickExternalLink: 'click_external_link',
  createComment: 'create_comment',
  replyComment: 'reply_comment',
} as const satisfies Record<string, AnalyticsEventName>;

type AnalyticsValue = string | number | boolean;

type GoogleAnalyticsFunction = (
  command: 'event',
  name: string,
  parameters: Record<string, AnalyticsValue>,
) => void;

type UmamiTracker = {
  track(eventName: string, data: Record<string, unknown>): void;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GoogleAnalyticsFunction;
    umami?: UmamiTracker;
  }
}

function toGoogleParameters(parameters: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(parameters).flatMap(([key, value]) => {
      if (value === undefined) return [];

      const normalizedKey = key.replace(/[A-Z]/g, (character) => `_${character.toLowerCase()}`);
      return [[normalizedKey, value as AnalyticsValue]];
    }),
  );
}

export function trackEvent<TName extends AnalyticsEventName>(
  name: TName,
  parameters: AnalyticsEventParameters[TName],
) {
  if (typeof window === 'undefined') return;

  try {
    window.gtag?.('event', name, toGoogleParameters(parameters));
  } catch {}

  try {
    window.umami?.track(name, parameters);
  } catch {}
}
