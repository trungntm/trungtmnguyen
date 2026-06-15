'use client';

import { useEffect, type ReactNode } from 'react';

import { KBarProvider } from 'kbar';
import { useRouter } from 'next/navigation';

import { SearchCommand } from '@/components/search/search-command';
import { preloadSearchAssets } from '@/components/search/use-preload-search';
import type { Dictionary, Locale } from '@/lib/i18n';

type SearchProviderProps = {
  children: ReactNode;
  locale: Locale;
  dictionary: Dictionary;
};

export function SearchProvider({ children, locale, dictionary }: SearchProviderProps) {
  const router = useRouter();

  useEffect(() => {
    preloadSearchAssets();
  }, []);

  return (
    <KBarProvider
      actions={[
        {
          id: 'home',
          name: dictionary.navigation.home,
          section: dictionary.search.navigationSection,
          keywords: 'index landing',
          perform: () => router.push(`/${locale}`),
        },
        {
          id: 'about',
          name: dictionary.navigation.about,
          section: dictionary.search.navigationSection,
          keywords: 'profile biography',
          perform: () => router.push(`/${locale}/about`),
        },
        {
          id: 'blog',
          name: dictionary.navigation.blog,
          section: dictionary.search.navigationSection,
          keywords: 'posts writing notes articles',
          perform: () => router.push(`/${locale}/blog`),
        },
      ]}
      options={{
        animations: {
          enterMs: 0,
          exitMs: 0,
        },
        disableDocumentLock: true,
      }}
    >
      {children}
      <SearchCommand dictionary={dictionary} locale={locale} />
    </KBarProvider>
  );
}
