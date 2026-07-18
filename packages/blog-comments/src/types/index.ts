export const COMMENT_REACTION_TYPES = ['LIKE', 'HELPFUL'] as const;
export type CommentReactionType = (typeof COMMENT_REACTION_TYPES)[number];

export const COMMENT_REPORT_REASONS = [
  'SPAM',
  'HARASSMENT',
  'OFF_TOPIC',
  'INAPPROPRIATE',
  'OTHER',
] as const;
export type CommentReportReason = (typeof COMMENT_REPORT_REASONS)[number];

export type CommentAuthor = {
  type: 'GUEST' | 'ADMIN';
  displayName: string;
};

export type ReactionCounts = {
  like: number;
  helpful: number;
};

export type PublicComment = {
  id: string;
  parentId: string | null;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  updatedAt: string;
  reactions: ReactionCounts;
  viewerReaction: CommentReactionType | null;
  replyCount: number;
  replies: PublicComment[];
};

export type CommentPaginationData = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PublishedCommentList = {
  items: PublicComment[];
  pagination: CommentPaginationData;
};

export type CreateCommentInput = {
  postId: string;
  parentId?: string | null;
  displayName?: string;
  content: string;
  turnstileToken: string;
};

export type CreateCommentResult = {
  id: string;
  status: 'PENDING' | 'REJECTED';
  message: string;
};

export type ReportCommentResult = {
  id: string;
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
};

export type ApiSuccess<T> = { data: T };
export type ApiError = { error: { code: string; message: string } };

export type CommentMessages = {
  heading: string;
  adminBadge: string;
  displayNameLabel: string;
  displayNamePlaceholder: string;
  anonymousName: string;
  commentLabel: string;
  commentPlaceholder: string;
  characterCount: string;
  submit: string;
  submitting: string;
  reply: string;
  replyTo: string;
  cancelReply: string;
  showReplies: string;
  hideReplies: string;
  report: string;
  like: string;
  helpful: string;
  loading: string;
  empty: string;
  retry: string;
  previousPage: string;
  nextPage: string;
  paginationLabel: string;
  pageLabel: string;
  pendingApproval: string;
  formDisplayNameTooShort: string;
  formDisplayNameTooLong: string;
  formCommentTooShort: string;
  formCommentTooLong: string;
  turnstileRequired: string;
  turnstileError: string;
  networkError: string;
  rateLimitError: string;
  unknownError: string;
  reactionError: string;
  reportTitle: string;
  reportDescription: string;
  reportReasonLabel: string;
  reportDetailsLabel: string;
  reportDetailsPlaceholder: string;
  reportSubmit: string;
  reportSubmitting: string;
  reportCancel: string;
  reportSuccess: string;
  reportReasonRequired: string;
  reportReasons: Record<CommentReportReason, string>;
  closeDialog: string;
};
