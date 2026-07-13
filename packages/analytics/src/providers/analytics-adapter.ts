import type { AnalyticsEventName, AnalyticsEventParameters, AnalyticsPageView } from '../types';

export interface AnalyticsAdapter {
  readonly name: string;
  isEnabled(): boolean;
  trackPageView(pageView: AnalyticsPageView): void;
  trackEvent<TEventName extends AnalyticsEventName>(
    eventName: TEventName,
    parameters: AnalyticsEventParameters[TEventName],
  ): void;
}
