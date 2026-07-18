'use client';

import { Button, Card } from '@trungtmnguyen/ui';
import { useEffect, useState } from 'react';

import { useComments } from '../hooks/use-comments';
import { useCommentContext } from '../providers/comment-provider';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';
import { CommentPagination } from './comment-pagination';

export type CommentSectionProps = {
  pageSize?: number;
  postId: string;
};

export function CommentSection({ pageSize = 20, postId }: CommentSectionProps) {
  const { messages } = useCommentContext();
  const { comments, error, isLoading, page, pagination, retry, setPage, updateComment } =
    useComments(postId, pageSize);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4_000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <section aria-labelledby="blog-comments-heading" className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" id="blog-comments-heading">
        {messages.heading}
      </h2>

      <CommentForm key={postId} postId={postId} />

      {isLoading ? (
        <div aria-live="polite" className="space-y-3" role="status">
          <p className="text-sm text-muted">{messages.loading}</p>
          <div className="h-32 animate-pulse rounded-2xl border border-border bg-surface/50" />
          <div className="h-28 animate-pulse rounded-2xl border border-border bg-surface/50" />
        </div>
      ) : error ? (
        <Card className="space-y-3 p-5 text-center" role="alert">
          <p className="text-sm text-muted">{error}</p>
          <Button onClick={retry} size="sm" variant="secondary">
            {messages.retry}
          </Button>
        </Card>
      ) : comments.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted">{messages.empty}</Card>
      ) : (
        <CommentList
          comments={comments}
          onReported={() => setToast(messages.reportSuccess)}
          postId={postId}
          updateComment={updateComment}
        />
      )}

      {!isLoading && !error ? (
        <CommentPagination
          currentPage={page}
          onPageChange={(nextPage) => {
            void setPage(nextPage);
          }}
          totalPages={pagination.totalPages}
        />
      ) : null}

      {toast ? (
        <div
          className="fixed right-4 bottom-4 z-50 max-w-sm rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-xl"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </section>
  );
}
