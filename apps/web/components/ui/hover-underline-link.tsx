import type { ComponentProps, ReactNode } from 'react';

import { BaseLink } from '@/components/ui/links';
import { cn } from '@/lib/utils';

type HoverUnderlineLinkProps = Omit<ComponentProps<typeof BaseLink>, 'className'> & {
  children: ReactNode;
  className?: string;
  underlineClassName?: string;
};

export function HoverUnderlineLink({
  children,
  className,
  underlineClassName,
  ...props
}: HoverUnderlineLinkProps) {
  return (
    <BaseLink
      {...props}
      className={cn(
        'group relative inline-flex rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none',
        className,
      )}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute bottom-1 left-4 right-4 block h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-90 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100',
          underlineClassName,
        )}
      />
    </BaseLink>
  );
}
