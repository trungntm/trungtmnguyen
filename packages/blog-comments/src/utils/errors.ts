import { CommentApiError } from '../api/comment-api';
import type { CommentMessages } from '../types';

export function getFriendlyCommentError(error: unknown, messages: CommentMessages) {
  if (!(error instanceof CommentApiError)) return messages.unknownError;
  if (error.code === 'COMMENT_NETWORK_ERROR' || error.status === 0) return messages.networkError;
  if (error.code === 'COMMENT_RATE_LIMITED' || error.status === 429) return messages.rateLimitError;
  if (error.code === 'COMMENT_VERIFICATION_FAILED') return messages.turnstileError;
  return messages.unknownError;
}
