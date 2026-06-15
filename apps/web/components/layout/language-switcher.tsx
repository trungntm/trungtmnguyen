'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type Locale, getLocalizedPath, locales } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  locale: Locale;
  postTranslations?: Partial<Record<Locale, string>>;
};

function isLocalizedBlogDetail(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.length === 3 && locales.includes(segments[0] as Locale) && segments[1] === 'blog';
}

export function LanguageSwitcher({
  locale,
  postTranslations,
}: LanguageSwitcherProps) {
  const pathname = usePathname() ?? '/';
  const isBlogDetail = isLocalizedBlogDetail(pathname);

  return (
    <div className="inline-flex rounded-full border border-border bg-background/60 p-1">
        {locales.map((targetLocale) => {
          const translationSlug = postTranslations?.[targetLocale];
          const href =
            postTranslations && isBlogDetail
              ? translationSlug
                ? (`/${targetLocale}/blog/${translationSlug}` as Route)
                : null
              : (getLocalizedPath(targetLocale, pathname) as Route);
          const isActive = targetLocale === locale;

          return href ? (
            <Link
              key={targetLocale}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted hover:text-foreground focus-visible:text-foreground focus-visible:outline-none',
              )}
              href={href}
            >
              {targetLocale}
            </Link>
          ) : (
            <span
              key={targetLocale}
              aria-disabled="true"
              className="cursor-not-allowed rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-muted/45 uppercase"
            >
              {targetLocale}
            </span>
          );
        })}
    </div>
  );
}
