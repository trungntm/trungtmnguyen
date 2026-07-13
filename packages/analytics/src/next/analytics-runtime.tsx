'use client';

import { useEffect } from 'react';

import type { AnalyticsConfig } from '../types';
import { configureAnalyticsClient, resetAnalyticsClient } from '../client';
import { createAnalyticsAdapter } from '../providers';
import { AnalyticsPageViewTracker } from './analytics-page-view-tracker';

type AnalyticsRuntimeProps = {
  config: AnalyticsConfig;
};

export function AnalyticsRuntime({ config }: AnalyticsRuntimeProps) {
  useEffect(() => {
    if (config.enabled === false) {
      resetAnalyticsClient();
      return;
    }

    configureAnalyticsClient(config.providers.map(createAnalyticsAdapter));

    return () => {
      resetAnalyticsClient();
    };
  }, [config]);

  if (config.enabled === false || config.providers.length === 0) {
    return null;
  }

  return <AnalyticsPageViewTracker />;
}
