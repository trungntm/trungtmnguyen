export type GoogleAnalyticsProviderConfig = {
  provider: 'google-analytics';
  measurementId: string;
};

export type UmamiProviderConfig = {
  provider: 'umami';
  websiteId: string;
  scriptUrl: string;
};

export type AnalyticsProviderConfig = GoogleAnalyticsProviderConfig | UmamiProviderConfig;

export type AnalyticsConfig = {
  enabled?: boolean;
  providers: AnalyticsProviderConfig[];
};
