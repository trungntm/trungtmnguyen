import type { AnalyticsEventName, AnalyticsEventParameters, AnalyticsPageView } from '../../types';
import { normalizeEventParametersForGoogleAnalytics } from '../../client/parameter-normalizer';
import type { AnalyticsAdapter } from '../analytics-adapter';
import type { GoogleAnalyticsProviderConfig } from '../../types';

function isValidMeasurementId(measurementId: string) {
  return measurementId.trim().length > 0;
}

export class GoogleAnalyticsAdapter implements AnalyticsAdapter {
  readonly name = 'google-analytics';

  constructor(private readonly config: GoogleAnalyticsProviderConfig) {}

  isEnabled() {
    return isValidMeasurementId(this.config.measurementId);
  }

  trackPageView(pageView: AnalyticsPageView) {
    if (!this.isEnabled() || typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('event', 'page_view', {
      page_location: pageView.location,
      page_path: pageView.path,
      page_referrer: pageView.referrer,
      page_title: pageView.title,
    });
  }

  trackEvent<TEventName extends AnalyticsEventName>(
    eventName: TEventName,
    parameters: AnalyticsEventParameters[TEventName],
  ) {
    if (!this.isEnabled() || typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('event', eventName, normalizeEventParametersForGoogleAnalytics(parameters));
  }
}
