'use client';

import { Button } from '@trungtmnguyen/ui';

import { useCommentContext } from '../providers/comment-provider';
import { formatCommentMessage } from '../utils/messages';

type CommentPaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
};

function visiblePages(currentPage: number, totalPages: number) {
  const values = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return [...values].filter((page) => page > 0 && page <= totalPages).sort((a, b) => a - b);
}

export function CommentPagination({
  currentPage,
  onPageChange,
  totalPages,
}: CommentPaginationProps) {
  const { messages } = useCommentContext();
  if (totalPages <= 1) return null;
  const pages = visiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label={formatCommentMessage(messages.paginationLabel, {
        current: currentPage,
        total: totalPages,
      })}
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <Button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        size="sm"
        variant="secondary"
      >
        {messages.previousPage}
      </Button>
      {pages.map((page, index) => {
        const previousPage = pages[index - 1];
        return (
          <span className="contents" key={page}>
            {previousPage && page - previousPage > 1 ? <span aria-hidden="true">…</span> : null}
            <Button
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={formatCommentMessage(messages.pageLabel, { page })}
              className="min-w-9"
              onClick={() => onPageChange(page)}
              size="sm"
              variant={page === currentPage ? 'primary' : 'secondary'}
            >
              {page}
            </Button>
          </span>
        );
      })}
      <Button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        size="sm"
        variant="secondary"
      >
        {messages.nextPage}
      </Button>
    </nav>
  );
}
