'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useCommentContext } from '../providers/comment-provider';
import type { PublicComment } from '../types';
import { getFriendlyCommentError } from '../utils/errors';

export function useComments(postId: string, pageSize = 20) {
  const { api, messages } = useCommentContext();
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [page, setPageState] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(
    async (requestedPage: number) => {
      const currentRequest = ++requestId.current;
      setIsLoading(true);
      setError(null);
      try {
        const result = await api.fetchComments({ postId, page: requestedPage, pageSize });
        if (currentRequest !== requestId.current) return;
        setComments(result.items);
        setPagination(result.pagination);
        setPageState(result.pagination.page);
      } catch (loadError) {
        if (currentRequest !== requestId.current) return;
        setError(getFriendlyCommentError(loadError, messages));
      } finally {
        if (currentRequest === requestId.current) setIsLoading(false);
      }
    },
    [api, messages, pageSize, postId],
  );

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) void load(1);
    });
    return () => {
      active = false;
      requestId.current += 1;
    };
  }, [load]);

  const updateComment = useCallback((commentId: string, nextComment: PublicComment) => {
    setComments((current) =>
      current.map((comment) => {
        if (comment.id === commentId) return nextComment;
        const replyIndex = comment.replies.findIndex((reply) => reply.id === commentId);
        if (replyIndex < 0) return comment;
        const replies = [...comment.replies];
        replies[replyIndex] = nextComment;
        return { ...comment, replies };
      }),
    );
  }, []);

  return {
    comments,
    error,
    isLoading,
    page,
    pagination,
    retry: () => load(page),
    setPage: load,
    updateComment,
  };
}
