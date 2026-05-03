import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ChipProps = {
  children: ReactNode;
  className?: string;
};

export function Chip({ children, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border/80 bg-surface/75 px-3 py-1.5 text-sm font-medium text-foreground/85 shadow-[0_14px_40px_-34px_var(--shadow-color)]',
        className,
      )}
    >
      {children}
    </span>
  );
}
