import type { AnalyticsProviderConfig } from '../types';
import { GoogleAnalyticsAdapter } from './google-analytics';
import { UmamiAdapter } from './umami';
import type { AnalyticsAdapter } from './analytics-adapter';

function assertNever(value: never): never {
  throw new Error(`Unsupported analytics provider: ${JSON.stringify(value)}`);
}

export function createAnalyticsAdapter(config: AnalyticsProviderConfig): AnalyticsAdapter {
  switch (config.provider) {
    case 'google-analytics':
      return new GoogleAnalyticsAdapter(config);
    case 'umami':
      return new UmamiAdapter(config);
    default:
      return assertNever(config);
  }
}
