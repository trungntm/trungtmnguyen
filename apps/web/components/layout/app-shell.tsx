'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { LocaleProvider } from '@/components/i18n/locale-provider';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SearchProvider } from '@/components/search/search-provider';
import { defaultLocale, getDictionary, isValidLocale, type Locale } from '@/lib/i18n';

type AppShellProps = {
  children: ReactNode;
};

function getLocaleFromPathname(pathname: string | null): Locale {
  const firstSegment = pathname?.split('/').filter(Boolean)[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleProvider locale={locale}>
      <SearchProvider dictionary={dictionary} locale={locale}>
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="gradient-orb-left" />
            <div className="gradient-orb-right" />
            <div className="grid-overlay" />
          </div>
          <SiteHeader dictionary={dictionary} locale={locale} />
          <main className="flex-1">{children}</main>
          <SiteFooter dictionary={dictionary} />
        </div>
      </SearchProvider>
    </LocaleProvider>
  );
}
