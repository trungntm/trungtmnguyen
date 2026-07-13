export type AnalyticsEventParameters = {
  view_blog_post: {
    postId: string;
    slug: string;
    locale: string;
    title: string;
  };
  select_blog_tag: {
    tag: string;
    locale: string;
  };
  search_blog: {
    query: string;
    resultCount?: number;
    locale: string;
  };
  change_locale: {
    fromLocale: string;
    toLocale: string;
    destinationUrl: string;
  };
  select_series: {
    seriesId: string;
    slug: string;
    locale: string;
  };
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
    method: 'copy_link' | 'native_share' | 'facebook' | 'linkedin' | 'x';
  };
};

export type AnalyticsEventName = keyof AnalyticsEventParameters;
