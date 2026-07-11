import type { Route } from 'next';

import { BaseLink } from '@/components/ui/links';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getHref: (page: number) => Route;
  label: string;
  previousLabel: string;
  nextLabel: string;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return [...pages].filter((page) => page >= 1 && page <= totalPages).sort((left, right) => left - right);
}

export function Pagination({
  currentPage,
  totalPages,
  getHref,
  label,
  previousLabel,
  nextLabel,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-2">
      {currentPage > 1 ? (
        <BaseLink className={buttonVariants({ variant: 'secondary' })} href={getHref(currentPage - 1)}>
          {previousLabel}
        </BaseLink>
      ) : null}

      {visiblePages.map((page) => (
        <BaseLink
          key={page}
          aria-current={page === currentPage ? 'page' : undefined}
          className={cn(
            buttonVariants({ variant: page === currentPage ? 'primary' : 'secondary' }),
            'min-w-11 justify-center',
          )}
          href={getHref(page)}
        >
          {page}
        </BaseLink>
      ))}

      {currentPage < totalPages ? (
        <BaseLink className={buttonVariants({ variant: 'secondary' })} href={getHref(currentPage + 1)}>
          {nextLabel}
        </BaseLink>
      ) : null}
    </nav>
  );
}
