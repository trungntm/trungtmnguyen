'use client';

import { useCommentReaction } from '../hooks/use-comment-reaction';
import { useCommentContext } from '../providers/comment-provider';
import type { PublicComment } from '../types';
import { CommentItem } from './comment-item';

type CommentListProps = {
  comments: PublicComment[];
  onReported: () => void;
  postId: string;
  updateComment: (commentId: string, nextComment: PublicComment) => void;
};

export function CommentList({ comments, onReported, postId, updateComment }: CommentListProps) {
  const { messages } = useCommentContext();
  const { error, react } = useCommentReaction(updateComment);

  return (
    <div className="space-y-4">
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {messages.reactionError}
        </p>
      ) : null}
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReact={(item, type) => void react(item, type)}
          onReported={onReported}
          postId={postId}
        />
      ))}
    </div>
  );
}
