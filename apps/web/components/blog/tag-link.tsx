import type { Route } from 'next';
import Link from 'next/link';

import { getTagUrl } from '@/lib/blogs';
import { cn } from '@/lib/utils';

type TagLinkProps = {
  tag: string;
  size?: 'sm' | 'md';
  className?: string;
};

export function TagLink({ tag, size = 'sm', className }: TagLinkProps) {
  return (
    <Link
      aria-label={`Browse posts tagged ${tag}`}
      className={cn(
        'inline-flex rounded-full border border-primary/18 bg-primary/8 font-medium tracking-[0.18em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-primary/14 focus-visible:border-primary/45 focus-visible:bg-primary/14 focus-visible:outline-none',
        size === 'sm' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
        className,
      )}
      href={getTagUrl(tag) as Route}
    >
      {tag}
    </Link>
  );
}
