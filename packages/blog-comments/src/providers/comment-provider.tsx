'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { createCommentApi, type CommentApi } from '../api/comment-api';
import type { CommentMessages } from '../types';

type CommentContextValue = {
  api: CommentApi;
  locale: string;
  messages: CommentMessages;
  turnstileSiteKey: string;
  onCommentSubmitted: ((kind: 'comment' | 'reply') => void) | undefined;
};

const CommentContext = createContext<CommentContextValue | null>(null);

export type CommentProviderProps = {
  apiBaseUrl: string;
  children: ReactNode;
  locale: string;
  messages: CommentMessages;
  turnstileSiteKey: string;
  onCommentSubmitted?: (kind: 'comment' | 'reply') => void;
};

export function CommentProvider({
  apiBaseUrl,
  children,
  locale,
  messages,
  turnstileSiteKey,
  onCommentSubmitted,
}: CommentProviderProps) {
  const api = useMemo(() => createCommentApi({ apiBaseUrl }), [apiBaseUrl]);
  const value = useMemo(
    () => ({ api, locale, messages, onCommentSubmitted, turnstileSiteKey }),
    [api, locale, messages, onCommentSubmitted, turnstileSiteKey],
  );

  return <CommentContext.Provider value={value}>{children}</CommentContext.Provider>;
}

export function useCommentContext() {
  const context = useContext(CommentContext);
  if (!context) throw new Error('Comment components must be rendered inside CommentProvider.');
  return context;
}
