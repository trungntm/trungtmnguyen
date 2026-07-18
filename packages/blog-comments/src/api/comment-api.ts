import { z } from 'zod';

import type {
  ApiError,
  ApiSuccess,
  CommentReactionType,
  CommentReportReason,
  CreateCommentInput,
  CreateCommentResult,
  PublicComment,
  ReportCommentResult,
} from '../types';

const reactionSchema = z.enum(['LIKE', 'HELPFUL']);

const publicCommentSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    parentId: z.string().nullable(),
    author: z.object({ type: z.enum(['GUEST', 'ADMIN']), displayName: z.string() }),
    content: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    reactions: z.object({ like: z.number(), helpful: z.number() }),
    viewerReaction: reactionSchema.nullable(),
    replyCount: z.number(),
    replies: z.array(publicCommentSchema),
  }),
) as z.ZodType<PublicComment>;

const publishedCommentListSchema = z.object({
  items: z.array(publicCommentSchema),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

const createCommentResultSchema = z.object({
  id: z.string(),
  status: z.enum(['PENDING', 'REJECTED']),
  message: z.string(),
});

const reportCommentResultSchema = z.object({
  id: z.string(),
  status: z.enum(['OPEN', 'RESOLVED', 'DISMISSED']),
});

const apiErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

export class CommentApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, status: number) {
    super('The comment request failed.');
    this.name = 'CommentApiError';
    this.code = code;
    this.status = status;
  }
}

export type CommentApiConfig = {
  apiBaseUrl: string;
  fetcher?: typeof fetch;
};

export type FetchCommentsInput = {
  postId: string;
  page?: number;
  pageSize?: number;
  sort?: 'newest' | 'oldest';
};

function buildUrl(apiBaseUrl: string, pathname: string, searchParams?: URLSearchParams) {
  const baseUrl = apiBaseUrl.trim().replace(/\/+$/, '');
  if (!baseUrl) throw new CommentApiError('COMMENT_API_NOT_CONFIGURED', 500);

  const url = new URL(`${baseUrl}${pathname}`);
  if (searchParams) url.search = searchParams.toString();
  return url;
}

async function request<T>(
  config: CommentApiConfig,
  url: URL,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await (config.fetcher ?? fetch)(url, {
      ...init,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
      signal: init?.signal ?? AbortSignal.timeout(10_000),
    });
  } catch {
    throw new CommentApiError('COMMENT_NETWORK_ERROR', 0);
  }

  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const parsedError = apiErrorSchema.safeParse(payload);
    const error = parsedError.success ? (parsedError.data as ApiError) : null;
    throw new CommentApiError(error?.error.code ?? 'COMMENT_REQUEST_FAILED', response.status);
  }

  const parsed = z.object({ data: schema }).safeParse(payload);
  if (!parsed.success) throw new CommentApiError('COMMENT_INVALID_RESPONSE', 502);
  return (parsed.data as ApiSuccess<T>).data;
}

export function fetchComments(config: CommentApiConfig, input: FetchCommentsInput) {
  const searchParams = new URLSearchParams({
    page: String(input.page ?? 1),
    pageSize: String(input.pageSize ?? 20),
    sort: input.sort ?? 'newest',
  });
  const url = buildUrl(
    config.apiBaseUrl,
    `/api/public/blog/posts/${encodeURIComponent(input.postId)}/comments`,
    searchParams,
  );
  return request(config, url, publishedCommentListSchema);
}

export function createComment(config: CommentApiConfig, input: CreateCommentInput) {
  const url = buildUrl(
    config.apiBaseUrl,
    `/api/public/blog/posts/${encodeURIComponent(input.postId)}/comments`,
  );
  return request<CreateCommentResult>(config, url, createCommentResultSchema, {
    method: 'POST',
    body: JSON.stringify({
      parentId: input.parentId ?? null,
      displayName: input.displayName?.trim() || 'Anonymous Reader',
      content: input.content,
      turnstileToken: input.turnstileToken,
    }),
  });
}

export function addReaction(
  config: CommentApiConfig,
  commentId: string,
  type: CommentReactionType,
) {
  const url = buildUrl(
    config.apiBaseUrl,
    `/api/public/blog/comments/${encodeURIComponent(commentId)}/reaction`,
  );
  return request(config, url, z.object({ commentId: z.string(), reaction: reactionSchema }), {
    method: 'PUT',
    body: JSON.stringify({ type }),
  });
}

export function removeReaction(config: CommentApiConfig, commentId: string) {
  const url = buildUrl(
    config.apiBaseUrl,
    `/api/public/blog/comments/${encodeURIComponent(commentId)}/reaction`,
  );
  return request(config, url, z.object({ commentId: z.string(), reaction: z.null() }), {
    method: 'DELETE',
  });
}

export function reportComment(
  config: CommentApiConfig,
  commentId: string,
  input: { reason: CommentReportReason; details?: string },
) {
  const url = buildUrl(
    config.apiBaseUrl,
    `/api/public/blog/comments/${encodeURIComponent(commentId)}/reports`,
  );
  return request<ReportCommentResult>(config, url, reportCommentResultSchema, {
    method: 'POST',
    body: JSON.stringify({ reason: input.reason, details: input.details?.trim() || null }),
  });
}

export type CommentApi = ReturnType<typeof createCommentApi>;

export function createCommentApi(config: CommentApiConfig) {
  return {
    fetchComments: (input: FetchCommentsInput) => fetchComments(config, input),
    createComment: (input: CreateCommentInput) => createComment(config, input),
    addReaction: (commentId: string, type: CommentReactionType) =>
      addReaction(config, commentId, type),
    removeReaction: (commentId: string) => removeReaction(config, commentId),
    reportComment: (commentId: string, input: { reason: CommentReportReason; details?: string }) =>
      reportComment(config, commentId, input),
  };
}
