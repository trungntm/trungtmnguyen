'use client';

import { CommentProvider, CommentSection } from '@trungtmnguyen/blog-comments';
import { AnalyticsEventNames, trackEvent } from '@trungtmnguyen/analytics';

import type { Dictionary, Locale } from '@/lib/i18n';

type TrackedBlogCommentsProps = {
  apiBaseUrl: string;
  locale: Locale;
  messages: Dictionary['comments'];
  postId: string;
  turnstileSiteKey: string;
};

export function TrackedBlogComments({
  apiBaseUrl,
  locale,
  messages,
  postId,
  turnstileSiteKey,
}: TrackedBlogCommentsProps) {
  return (
    <CommentProvider
      apiBaseUrl={apiBaseUrl}
      locale={locale}
      messages={messages}
      onCommentSubmitted={(kind) => {
        trackEvent(
          kind === 'reply' ? AnalyticsEventNames.replyComment : AnalyticsEventNames.createComment,
          { locale, postId },
        );
      }}
      turnstileSiteKey={turnstileSiteKey}
    >
      <CommentSection postId={postId} />
    </CommentProvider>
  );
}
