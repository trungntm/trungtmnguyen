'use client';

import { Search } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useKBar } from 'kbar';

type SearchButtonProps = {
  label: string;
  openLabel: string;
};

export function SearchButton({ label, openLabel }: SearchButtonProps) {
  const { query } = useKBar();

  return (
    <button
      aria-label={openLabel}
      className={cn(
        buttonVariants({ variant: 'secondary' }),
        'size-10 shrink-0 rounded-full border-border bg-background/60 px-0 text-muted shadow-sm hover:bg-background/80 hover:text-foreground sm:h-10 sm:w-auto sm:gap-2 sm:px-4',
      )}
      type="button"
      onClick={() => query.toggle()}
    >
      <Search className="size-4" />
      <span className="hidden text-sm font-medium sm:inline">{label}</span>
      <span className="hidden text-xs text-muted/90 sm:inline">⌘K / Ctrl K</span>
    </button>
  );
}
