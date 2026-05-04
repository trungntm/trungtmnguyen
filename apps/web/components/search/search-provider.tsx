'use client';

import { useEffect, type ReactNode } from 'react';

import { KBarProvider } from 'kbar';
import { useRouter } from 'next/navigation';

import { SearchCommand } from '@/components/search/search-command';
import { preloadSearchAssets } from '@/components/search/use-preload-search';

type SearchProviderProps = {
  children: ReactNode;
};

export function SearchProvider({ children }: SearchProviderProps) {
  const router = useRouter();

  useEffect(() => {
    preloadSearchAssets();
  }, []);

  return (
    <KBarProvider
      actions={[
        {
          id: 'home',
          name: 'Home',
          section: 'Navigation',
          keywords: 'index landing',
          perform: () => router.push('/'),
        },
        {
          id: 'about',
          name: 'About',
          section: 'Navigation',
          keywords: 'profile biography',
          perform: () => router.push('/about'),
        },
        {
          id: 'blog',
          name: 'Blog',
          section: 'Navigation',
          keywords: 'posts writing notes articles',
          perform: () => router.push('/blog'),
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
      <SearchCommand />
    </KBarProvider>
  );
}
