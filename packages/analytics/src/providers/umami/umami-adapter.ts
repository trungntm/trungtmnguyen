import type { AnalyticsEventName, AnalyticsEventParameters, AnalyticsPageView } from '../../types';
import type { UmamiProviderConfig } from '../../types';
import type { AnalyticsAdapter } from '../analytics-adapter';

function isValidUmamiConfig(config: UmamiProviderConfig) {
  return config.websiteId.trim().length > 0 && config.scriptUrl.trim().length > 0;
}

export class UmamiAdapter implements AnalyticsAdapter {
  readonly name = 'umami';

  constructor(private readonly config: UmamiProviderConfig) {}

  isEnabled() {
    return isValidUmamiConfig(this.config);
  }

  trackPageView(pageView: AnalyticsPageView) {
    if (!this.isEnabled() || typeof window === 'undefined' || !window.umami) {
      return;
    }

    window.umami.track({
      ...(pageView.referrer ? { referrer: pageView.referrer } : {}),
      ...(pageView.title ? { title: pageView.title } : {}),
      url: pageView.path,
      website: this.config.websiteId,
    });
  }

  trackEvent<TEventName extends AnalyticsEventName>(
    eventName: TEventName,
    parameters: AnalyticsEventParameters[TEventName],
  ) {
    if (!this.isEnabled() || typeof window === 'undefined' || !window.umami) {
      return;
    }

    const data = Object.fromEntries(
      Object.entries(parameters).flatMap(([key, value]) => {
        if (value === undefined) {
          return [];
        }

        return [[key, value] as const];
      }),
    );

    window.umami.track(eventName, data);
  }
}
