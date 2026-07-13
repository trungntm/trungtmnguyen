'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { ErrorState } from '@/components/layout/error-state';
import { defaultLocale, getDictionary, getLocalizedPath, isValidLocale } from '@/lib/i18n';

function getLocaleFromPathname(pathname: string | null) {
  const firstSegment = pathname?.split('/').filter(Boolean)[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorBoundaryProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const homeHref = getLocalizedPath(locale, '/');
  const blogHref = getLocalizedPath(locale, '/blog');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      eyebrow={dictionary.errors.eyebrow}
      title={dictionary.errors.title}
      description={dictionary.errors.description}
      retryLabel={dictionary.errors.retry}
      onRetry={reset}
      primaryActionHref={homeHref}
      primaryActionLabel={dictionary.errors.home}
      secondaryActionHref={blogHref}
      secondaryActionLabel={dictionary.errors.blog}
    />
  );
}
