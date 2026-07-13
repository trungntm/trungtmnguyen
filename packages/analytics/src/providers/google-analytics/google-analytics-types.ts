export type GoogleAnalyticsCommand =
  | ['js', Date]
  | ['config', string, Record<string, string | number | boolean | undefined>]
  | ['event', string, Record<string, string | number | boolean | undefined>];

export type GoogleAnalyticsFunction = (...command: GoogleAnalyticsCommand) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GoogleAnalyticsFunction;
  }
}

export {};
