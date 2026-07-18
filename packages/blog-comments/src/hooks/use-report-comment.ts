'use client';

import { useCallback, useRef, useState } from 'react';

import { useCommentContext } from '../providers/comment-provider';
import type { CommentReportReason } from '../types';
import { getFriendlyCommentError } from '../utils/errors';

export function useReportComment() {
  const { api, messages } = useCommentContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);

  const submit = useCallback(
    async (commentId: string, input: { reason: CommentReportReason; details?: string }) => {
      if (pending.current) return false;
      pending.current = true;
      setIsSubmitting(true);
      setError(null);
      try {
        await api.reportComment(commentId, input);
        return true;
      } catch (submitError) {
        setError(getFriendlyCommentError(submitError, messages));
        return false;
      } finally {
        pending.current = false;
        setIsSubmitting(false);
      }
    },
    [api, messages],
  );

  return { error, isSubmitting, submit };
}
