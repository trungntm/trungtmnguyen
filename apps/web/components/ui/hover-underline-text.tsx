import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type HoverUnderlineTextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  underlineClassName?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function HoverUnderlineText<T extends ElementType = 'span'>({
  as,
  children,
  className,
  underlineClassName,
  ...props
}: HoverUnderlineTextProps<T>) {
  const Component = (as ?? 'span') as ElementType;

  return (
    <Component className={cn('group inline-flex flex-col', className)} {...props}>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          'mt-2 block h-0.5 w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-90 transition-transform duration-300 ease-out group-hover:scale-x-100',
          underlineClassName,
        )}
      />
    </Component>
  );
}
