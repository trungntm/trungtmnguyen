'use client';

import { Button } from '@trungtmnguyen/ui';

import type { CommentReactionType, PublicComment } from '../types';

type CommentReactionsProps = {
  comment: PublicComment;
  helpfulLabel: string;
  likeLabel: string;
  onReact: (comment: PublicComment, type: CommentReactionType) => void;
};

export function CommentReactions({
  comment,
  helpfulLabel,
  likeLabel,
  onReact,
}: CommentReactionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1" role="group">
      <Button
        aria-label={`${likeLabel}: ${comment.reactions.like}`}
        aria-pressed={comment.viewerReaction === 'LIKE'}
        className={`h-8 px-2.5 ${
          comment.viewerReaction === 'LIKE' ? 'text-primary' : 'text-muted hover:text-foreground'
        }`}
        onClick={() => onReact(comment, 'LIKE')}
        size="sm"
        variant="ghost"
      >
        {likeLabel} <span aria-hidden="true">· {comment.reactions.like}</span>
      </Button>
      <Button
        aria-label={`${helpfulLabel}: ${comment.reactions.helpful}`}
        aria-pressed={comment.viewerReaction === 'HELPFUL'}
        className={`h-8 px-2.5 ${
          comment.viewerReaction === 'HELPFUL' ? 'text-primary' : 'text-muted hover:text-foreground'
        }`}
        onClick={() => onReact(comment, 'HELPFUL')}
        size="sm"
        variant="ghost"
      >
        {helpfulLabel} <span aria-hidden="true">· {comment.reactions.helpful}</span>
      </Button>
    </div>
  );
}
