'use client';

import { Suspense, type ReactNode } from 'react';

import type {
  AnalyticsConfig,
  GoogleAnalyticsProviderConfig,
  UmamiProviderConfig,
} from '../types';
import { GoogleAnalyticsScript, UmamiScript } from '../providers';
import { AnalyticsRuntime } from './analytics-runtime';

type AnalyticsProviderProps = {
  children: ReactNode;
  config: AnalyticsConfig;
};

function isNonEmpty(value: string) {
  return value.trim().length > 0;
}

function isEnabledGoogleAnalyticsProvider(
  provider: GoogleAnalyticsProviderConfig,
): provider is GoogleAnalyticsProviderConfig {
  return isNonEmpty(provider.measurementId);
}

function isEnabledUmamiProvider(provider: UmamiProviderConfig): provider is UmamiProviderConfig {
  return isNonEmpty(provider.websiteId) && isNonEmpty(provider.scriptUrl);
}

export function AnalyticsProvider({ children, config }: AnalyticsProviderProps) {
  const isAnalyticsEnabled = config.enabled !== false;
  const googleAnalyticsProviders = isAnalyticsEnabled
    ? config.providers.filter(
        (provider): provider is GoogleAnalyticsProviderConfig =>
          provider.provider === 'google-analytics' && isEnabledGoogleAnalyticsProvider(provider),
      )
    : [];
  const umamiProviders = isAnalyticsEnabled
    ? config.providers.filter(
        (provider): provider is UmamiProviderConfig =>
          provider.provider === 'umami' && isEnabledUmamiProvider(provider),
      )
    : [];
  const uniqueGoogleMeasurementIds = [...new Set(googleAnalyticsProviders.map((provider) => provider.measurementId))];
  const uniqueUmamiProviders = umamiProviders.filter(
    (provider, index, providers) =>
      providers.findIndex(
        (entry) => entry.websiteId === provider.websiteId && entry.scriptUrl === provider.scriptUrl,
      ) === index,
  );

  return (
    <>
      {children}
      {uniqueGoogleMeasurementIds.length > 0 ? (
        <GoogleAnalyticsScript measurementIds={uniqueGoogleMeasurementIds} />
      ) : null}
      {uniqueUmamiProviders.map((provider) => (
        <UmamiScript
          key={`${provider.scriptUrl}:${provider.websiteId}`}
          scriptUrl={provider.scriptUrl}
          websiteId={provider.websiteId}
        />
      ))}
      <Suspense fallback={null}>
        <AnalyticsRuntime config={config} />
      </Suspense>
    </>
  );
}
