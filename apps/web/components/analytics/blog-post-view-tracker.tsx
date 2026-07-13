'use client';

import { useEffect } from 'react';

import { AnalyticsEventNames } from '@trungtmnguyen/analytics';
import { trackEvent } from '@trungtmnguyen/analytics/client';

type BlogPostViewTrackerProps = {
  postId: string;
  slug: string;
  locale: string;
  title: string;
};

let lastTrackedBlogPostKey: string | null = null;

export function BlogPostViewTracker({ postId, slug, locale, title }: BlogPostViewTrackerProps) {
  useEffect(() => {
    const key = `${locale}:${postId}:${slug}`;

    if (lastTrackedBlogPostKey === key) {
      return;
    }

    lastTrackedBlogPostKey = key;

    trackEvent(AnalyticsEventNames.viewBlogPost, {
      locale,
      postId,
      slug,
      title,
    });
  }, [locale, postId, slug, title]);

  return null;
}
