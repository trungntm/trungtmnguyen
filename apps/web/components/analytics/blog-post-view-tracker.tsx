'use client';

import { useEffect, useRef } from 'react';

import { AnalyticsEventNames, trackEvent } from '@trungtmnguyen/analytics';

type BlogPostViewTrackerProps = {
  postId: string;
  slug: string;
  locale: string;
  title: string;
};

export function BlogPostViewTracker({ postId, slug, locale, title }: BlogPostViewTrackerProps) {
  const lastTrackedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const key = `${locale}:${postId}:${slug}`;

    if (lastTrackedKeyRef.current === key) {
      return;
    }

    lastTrackedKeyRef.current = key;

    trackEvent(AnalyticsEventNames.viewBlogPost, {
      locale,
      postId,
      slug,
      title,
    });
  }, [locale, postId, slug, title]);

  return null;
}
