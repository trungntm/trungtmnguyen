'use client';

import { useEffect } from 'react';

import type {
  PublicPostTranslationLinkDto,
  PublicSeriesTranslationLinkDto,
} from '@/features/cms-blog/types';

import { useBlogTranslations } from './blog-translations-context';

type BlogDetailTranslationSyncProps = {
  translations: Array<PublicPostTranslationLinkDto | PublicSeriesTranslationLinkDto>;
};

export function BlogDetailTranslationSync({ translations }: BlogDetailTranslationSyncProps) {
  const { setTranslations } = useBlogTranslations();

  useEffect(() => {
    setTranslations(translations);

    return () => {
      setTranslations(undefined);
    };
  }, [setTranslations, translations]);

  return null;
}
