'use client';

import { Badge, Button, Card } from '@trungtmnguyen/ui';
import { ChevronDown, Flag, Reply } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { useCommentContext } from '../providers/comment-provider';
import type { CommentReactionType, PublicComment } from '../types';
import { formatCommentMessage } from '../utils/messages';
import { CommentAvatar } from './comment-avatar';
import { CommentForm } from './comment-form';
import { CommentReactions } from './comment-reactions';
import { CommentReportDialog } from './comment-report-dialog';

type CommentItemProps = {
  comment: PublicComment;
  isReply?: boolean;
  onReact: (comment: PublicComment, type: CommentReactionType) => void;
  onReported: () => void;
  postId: string;
};

export const CommentItem = memo(function CommentItem({
  comment,
  isReply = false,
  onReact,
  onReported,
  postId,
}: CommentItemProps) {
  const { locale, messages } = useCommentContext();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubmitted, setReplySubmitted] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const createdDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
        new Date(comment.createdAt),
      );
    } catch {
      return comment.createdAt;
    }
  }, [comment.createdAt, locale]);

  return (
    <article aria-labelledby={`comment-author-${comment.id}`}>
      <Card
        className={
          isReply
            ? 'border-0 bg-transparent p-0 shadow-none'
            : 'rounded-2xl bg-surface/50 p-4 sm:p-5'
        }
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <CommentAvatar displayName={comment.author.displayName} isReply={isReply} />

          <div className="min-w-0 flex-1 space-y-3">
            <header className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-semibold leading-5" id={`comment-author-${comment.id}`}>
                {comment.author.displayName}
              </p>
              {comment.author.type === 'ADMIN' ? (
                <Badge className="px-2 py-0.5">{messages.adminBadge}</Badge>
              ) : null}
              <span aria-hidden="true" className="text-xs text-muted">
                ·
              </span>
              <time className="text-xs text-muted" dateTime={comment.createdAt}>
                {createdDate}
              </time>
            </header>

            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7">
              {comment.content}
            </p>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
              <CommentReactions
                comment={comment}
                helpfulLabel={messages.helpful}
                likeLabel={messages.like}
                onReact={onReact}
              />
              {!isReply ? (
                <Button
                  aria-controls={`reply-form-${comment.id}`}
                  aria-expanded={replyOpen}
                  className="h-8 gap-1.5 px-2.5 text-muted hover:text-primary"
                  onClick={() => {
                    setReplySubmitted(false);
                    setReplyOpen((value) => !value);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Reply aria-hidden="true" className="size-3.5" />
                  {messages.reply}
                </Button>
              ) : null}
              <Button
                className="h-8 gap-1.5 px-2.5 text-muted hover:text-foreground"
                onClick={() => setReportOpen(true)}
                size="sm"
                variant="ghost"
              >
                <Flag aria-hidden="true" className="size-3.5" />
                {messages.report}
              </Button>
            </div>

            {!isReply && comment.replies.length > 0 ? (
              <Button
                aria-controls={`comment-replies-${comment.id}`}
                aria-expanded={repliesOpen}
                className="h-8 gap-1.5 px-2 text-primary hover:bg-primary/5"
                onClick={() => setRepliesOpen((value) => !value)}
                size="sm"
                variant="ghost"
              >
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 transition-transform duration-200 ${repliesOpen ? 'rotate-180' : ''}`}
                />
                {formatCommentMessage(repliesOpen ? messages.hideReplies : messages.showReplies, {
                  count: comment.replies.length,
                })}
              </Button>
            ) : null}

            {replySubmitted ? (
              <p className="text-sm font-medium text-emerald-600" role="status">
                {messages.pendingApproval}
              </p>
            ) : null}

            {!isReply && replyOpen ? (
              <div className="border-t border-border pt-4" id={`reply-form-${comment.id}`}>
                <CommentForm
                  onCancel={() => setReplyOpen(false)}
                  onSubmitted={() => {
                    setReplyOpen(false);
                    setReplySubmitted(true);
                  }}
                  parentId={comment.id}
                  postId={postId}
                  replyToName={comment.author.displayName}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      {!isReply && comment.replies.length > 0 && repliesOpen ? (
        <div
          className="mt-3 ml-4 space-y-4 border-l border-border pl-3 sm:ml-7 sm:pl-5"
          id={`comment-replies-${comment.id}`}
        >
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply
              onReact={onReact}
              onReported={onReported}
              postId={postId}
            />
          ))}
        </div>
      ) : null}

      <CommentReportDialog
        commentId={comment.id}
        onOpenChange={setReportOpen}
        onSuccess={onReported}
        open={reportOpen}
      />
    </article>
  );
});
