'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { trackPageView } from '../client';
import { buildAnalyticsPath, shouldTrackPageView } from './page-view-utils';

let lastTrackedPath: string | null = null;

export function AnalyticsPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const path = buildAnalyticsPath(pathname, searchParams);

    if (!shouldTrackPageView(lastTrackedPath, path)) {
      return;
    }

    lastTrackedPath = path;

    trackPageView({
      path,
      location: window.location.href,
      ...(document.referrer ? { referrer: document.referrer } : {}),
      ...(document.title ? { title: document.title } : {}),
    });
  }, [pathname, searchParams]);

  return null;
}
