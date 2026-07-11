'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import type {
  PublicPostTranslationLinkDto,
  PublicSeriesTranslationLinkDto,
} from '@/features/cms-blog/types';

type LocalizedRouteTranslation = PublicPostTranslationLinkDto | PublicSeriesTranslationLinkDto;

type BlogTranslationContextValue = {
  translations: LocalizedRouteTranslation[] | undefined;
  setTranslations: (translations: LocalizedRouteTranslation[] | undefined) => void;
};

const BlogTranslationContext = createContext<BlogTranslationContextValue | null>(null);

type BlogTranslationProviderProps = {
  children: ReactNode;
};

export function BlogTranslationProvider({ children }: BlogTranslationProviderProps) {
  const [translations, setTranslations] = useState<LocalizedRouteTranslation[] | undefined>(undefined);

  return (
    <BlogTranslationContext.Provider
      value={{
        translations,
        setTranslations,
      }}
    >
      {children}
    </BlogTranslationContext.Provider>
  );
}

export function useBlogTranslations() {
  const context = useContext(BlogTranslationContext);

  if (!context) {
    throw new Error('useBlogTranslations must be used within BlogTranslationProvider.');
  }

  return context;
}
