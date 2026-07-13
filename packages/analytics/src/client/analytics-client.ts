import type { AnalyticsEventName, AnalyticsEventParameters, AnalyticsPageView } from '../types';
import type { AnalyticsAdapter } from '../providers/analytics-adapter';

class AnalyticsClient {
  private adapters: AnalyticsAdapter[] = [];

  setAdapters(adapters: AnalyticsAdapter[]) {
    this.adapters = adapters;
  }

  reset() {
    this.adapters = [];
  }

  trackPageView(pageView: AnalyticsPageView) {
    for (const adapter of this.adapters) {
      if (!adapter.isEnabled()) {
        continue;
      }

      try {
        adapter.trackPageView(pageView);
      } catch {}
    }
  }

  trackEvent<TEventName extends AnalyticsEventName>(
    eventName: TEventName,
    parameters: AnalyticsEventParameters[TEventName],
  ) {
    for (const adapter of this.adapters) {
      if (!adapter.isEnabled()) {
        continue;
      }

      try {
        adapter.trackEvent(eventName, parameters);
      } catch {}
    }
  }
}

const analyticsClient = new AnalyticsClient();

export function configureAnalyticsClient(adapters: AnalyticsAdapter[]) {
  analyticsClient.setAdapters(adapters);
}

export function resetAnalyticsClient() {
  analyticsClient.reset();
}

export function trackPageView(pageView: AnalyticsPageView) {
  analyticsClient.trackPageView(pageView);
}

export function trackEvent<TEventName extends AnalyticsEventName>(
  eventName: TEventName,
  parameters: AnalyticsEventParameters[TEventName],
) {
  analyticsClient.trackEvent(eventName, parameters);
}
