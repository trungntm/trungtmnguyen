'use client';

import { useCallback, useRef, useState } from 'react';

import { useCommentContext } from '../providers/comment-provider';
import type { CommentReactionType, PublicComment } from '../types';

function optimisticReaction(comment: PublicComment, next: CommentReactionType | null) {
  const reactions = { ...comment.reactions };
  if (comment.viewerReaction === 'LIKE') reactions.like = Math.max(0, reactions.like - 1);
  if (comment.viewerReaction === 'HELPFUL') {
    reactions.helpful = Math.max(0, reactions.helpful - 1);
  }
  if (next === 'LIKE') reactions.like += 1;
  if (next === 'HELPFUL') reactions.helpful += 1;
  return { ...comment, reactions, viewerReaction: next };
}

export function useCommentReaction(
  updateComment: (commentId: string, nextComment: PublicComment) => void,
) {
  const { api } = useCommentContext();
  const [error, setError] = useState(false);
  const pendingIds = useRef(new Set<string>());

  const react = useCallback(
    async (comment: PublicComment, type: CommentReactionType) => {
      if (pendingIds.current.has(comment.id)) return;
      pendingIds.current.add(comment.id);
      setError(false);

      const nextReaction = comment.viewerReaction === type ? null : type;
      updateComment(comment.id, optimisticReaction(comment, nextReaction));
      try {
        if (nextReaction) await api.addReaction(comment.id, nextReaction);
        else await api.removeReaction(comment.id);
      } catch {
        updateComment(comment.id, comment);
        setError(true);
      } finally {
        pendingIds.current.delete(comment.id);
      }
    },
    [api, updateComment],
  );

  return { error, react };
}
