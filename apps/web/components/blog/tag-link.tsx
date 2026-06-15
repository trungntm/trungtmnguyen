import type { Route } from 'next';

import { BaseLink } from '@/components/ui/links';
import { getTagUrl } from '@/lib/blogs';
import { formatMessage, getDictionary, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type TagLinkProps = {
  locale: Locale;
  tag: string;
  size?: 'sm' | 'md';
  className?: string;
  ariaLabel?: string;
};

export function TagLink({ locale, tag, size = 'sm', className, ariaLabel }: TagLinkProps) {
  const dictionary = getDictionary(locale);
  const defaultAriaLabel = formatMessage(dictionary.tagLink.ariaLabel, { tag });

  return (
    <BaseLink
      aria-label={ariaLabel ?? defaultAriaLabel}
      className={cn(
        'inline-flex rounded-full border border-primary/18 bg-primary/8 font-medium tracking-[0.18em] text-primary uppercase transition-colors hover:border-primary/35 hover:bg-primary/14 focus-visible:border-primary/45 focus-visible:bg-primary/14 focus-visible:outline-none',
        size === 'sm' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
        className,
      )}
      href={getTagUrl(locale, tag).replace(`/${locale}`, '') as Route}
    >
      {tag}
    </BaseLink>
  );
}
