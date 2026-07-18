'use client';

import { useCallback, useRef, useState } from 'react';

import { useCommentContext } from '../providers/comment-provider';
import { commentContentSchema, displayNameSchema } from '../schemas';
import type { CreateCommentInput } from '../types';
import { getFriendlyCommentError } from '../utils/errors';

export type CommentFormErrors = {
  displayName?: string;
  content?: string;
  turnstile?: string;
};

export function useCreateComment() {
  const { api, messages } = useCommentContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CommentFormErrors>({});
  const pending = useRef(false);

  const submit = useCallback(
    async (input: CreateCommentInput) => {
      if (pending.current) return false;

      const errors: CommentFormErrors = {};
      const displayName = input.displayName?.trim() ?? '';
      if (displayName) {
        const parsedName = displayNameSchema.safeParse(displayName);
        if (!parsedName.success) {
          errors.displayName =
            displayName.length < 2
              ? messages.formDisplayNameTooShort
              : messages.formDisplayNameTooLong;
        }
      }
      const parsedContent = commentContentSchema.safeParse(input.content);
      if (!parsedContent.success) {
        errors.content =
          input.content.trim().length < 2
            ? messages.formCommentTooShort
            : messages.formCommentTooLong;
      }
      if (!input.turnstileToken) errors.turnstile = messages.turnstileRequired;

      setFieldErrors(errors);
      setError(null);
      if (Object.keys(errors).length > 0) return false;

      pending.current = true;
      setIsSubmitting(true);
      try {
        const result = await api.createComment(input);
        if (result.status !== 'PENDING') {
          setError(messages.unknownError);
          return false;
        }
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

  return { error, fieldErrors, isSubmitting, submit };
}
