'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

import { TableOfContentsList } from '@/components/blog/table-of-contents';
import type { TocItem } from '@/lib/toc';
import { cn } from '@/lib/utils';

type MobileTableOfContentsProps = {
  items: TocItem[];
  label: string;
};

export function MobileTableOfContents({ items, label }: MobileTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  if (items.length < 2) {
    return null;
  }

  return (
    <div className="glass-card overflow-hidden rounded-[1.75rem]">
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold tracking-wide text-foreground transition-colors hover:bg-background/35 focus-visible:bg-background/35 focus-visible:outline-none"
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span>{label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 text-muted transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div
          aria-hidden={!isOpen}
          className="min-h-0 overflow-hidden"
          id={contentId}
          inert={!isOpen}
        >
          <nav aria-label={label} className="border-t border-border/70 px-5 pb-5">
            <TableOfContentsList items={items} onNavigate={() => setIsOpen(false)} />
          </nav>
        </div>
      </div>
    </div>
  );
}
