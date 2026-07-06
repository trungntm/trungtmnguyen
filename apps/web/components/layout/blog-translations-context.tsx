'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import type { PublicPostTranslationLinkDto } from '@/features/cms-blog/types';

type BlogTranslationContextValue = {
  translations: PublicPostTranslationLinkDto[] | undefined;
  setTranslations: (translations: PublicPostTranslationLinkDto[] | undefined) => void;
};

const BlogTranslationContext = createContext<BlogTranslationContextValue | null>(null);

type BlogTranslationProviderProps = {
  children: ReactNode;
};

export function BlogTranslationProvider({ children }: BlogTranslationProviderProps) {
  const [translations, setTranslations] = useState<PublicPostTranslationLinkDto[] | undefined>(undefined);

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
