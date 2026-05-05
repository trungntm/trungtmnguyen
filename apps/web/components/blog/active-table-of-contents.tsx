'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { TocItem } from '@/lib/toc';
import { cn } from '@/lib/utils';

type ActiveTableOfContentsProps = {
  items: TocItem[];
};

export function ActiveTableOfContents({ items }: ActiveTableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null);

    if (headings.length === 0) {
      return;
    }

    const headingOrder = new Map(items.map((item, index) => [item.id, index]));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              (headingOrder.get(left.target.id) ?? 0) - (headingOrder.get(right.target.id) ?? 0),
          );
        const firstVisibleHeading = visibleHeadings[0];

        if (firstVisibleHeading) {
          setActiveId(firstVisibleHeading.target.id);
        }
      },
      {
        rootMargin: '-96px 0px -60% 0px',
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      observer.disconnect();
    };
  }, [items]);

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold tracking-[0.24em] text-muted uppercase">On this page</p>
      <ol className="mt-4 space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              className={cn(
                'block rounded-xl px-3 py-2 text-sm leading-6 text-muted transition-colors hover:bg-background/50 hover:text-foreground focus-visible:bg-background/50 focus-visible:text-foreground focus-visible:outline-none',
                item.depth === 3 && 'ml-4',
                activeId === item.id && 'bg-primary/10 text-primary',
              )}
              href={`#${item.id}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
