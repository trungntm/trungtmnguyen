import type { TocItem } from '@/lib/toc';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type TableOfContentsProps = {
  items: TocItem[];
  label?: string;
};

export function TableOfContents({ items, label = 'On this page' }: TableOfContentsProps) {
  if (items.length < 2) {
    return null;
  }

  const minDepth = Math.min(...items.map((item) => item.depth));

  return (
    <div className="glass-card rounded-[1.75rem] p-5">
      <nav aria-label="Table of contents">
        <p className="text-xs font-semibold tracking-[0.24em] text-muted uppercase">
          {label}
        </p>
        <ol className="mt-4 space-y-1.5">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                'relative pl-4',
                item.depth === minDepth + 1 && 'ml-4',
                item.depth >= minDepth + 2 && 'ml-8',
              )}
            >
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-0 size-1.5 -translate-y-1/2 rounded-full bg-muted/55 transition-colors"
              />
              <Link
                className="block rounded-xl px-3 py-2 text-xs leading-4 text-muted transition-colors hover:bg-background/50 hover:text-foreground focus-visible:bg-background/50 focus-visible:text-foreground focus-visible:outline-none"
                href={`#${item.id}`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
