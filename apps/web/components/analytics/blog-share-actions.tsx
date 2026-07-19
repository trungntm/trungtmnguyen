'use client';

import { Check, Link as LinkIcon, Share2 } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';

import { AnalyticsEventNames, trackEvent } from '@trungtmnguyen/analytics';

import type { Locale } from '@/lib/i18n';

type BlogShareActionsProps = {
  copyLabel: string;
  copiedLabel: string;
  locale: Locale;
  postId: string;
  shareLabel: string;
  slug: string;
  title: string;
  url: string;
};

function subscribeToShareAvailability() {
  return () => {};
}

function getShareAvailability() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export function BlogShareActions({
  copyLabel,
  copiedLabel,
  locale,
  postId,
  shareLabel,
  slug,
  title,
  url,
}: BlogShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    subscribeToShareAvailability,
    getShareAvailability,
    () => false,
  );

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    trackEvent(AnalyticsEventNames.shareBlogPost, {
      locale,
      method: 'copy_link',
      postId,
      slug,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_600);
  }

  async function sharePost() {
    if (!canNativeShare) return;

    try {
      await navigator.share({ title, url });
      trackEvent(AnalyticsEventNames.shareBlogPost, {
        locale,
        method: 'native_share',
        postId,
        slug,
      });
    } catch {
      // Cancelling the share sheet is not a completed share intent.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canNativeShare ? (
        <button
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/35 hover:text-foreground"
          onClick={sharePost}
          type="button"
        >
          <Share2 aria-hidden="true" className="size-3.5" />
          {shareLabel}
        </button>
      ) : null}
      <button
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/35 hover:text-foreground"
        onClick={copyLink}
        type="button"
      >
        {copied ? (
          <Check aria-hidden="true" className="size-3.5" />
        ) : (
          <LinkIcon aria-hidden="true" className="size-3.5" />
        )}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
