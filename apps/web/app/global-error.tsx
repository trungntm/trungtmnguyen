'use client';

import { useEffect, useSyncExternalStore } from 'react';

import { ErrorState } from '@/components/layout/error-state';
import { defaultLocale, getDictionary, getLocalizedPath, isValidLocale } from '@/lib/i18n';

function getLocaleFromPathname(pathname: string | null) {
  const firstSegment = pathname?.split('/').filter(Boolean)[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

const emptySubscribe = () => () => undefined;

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const locale = useSyncExternalStore(
    emptySubscribe,
    () => getLocaleFromPathname(window.location.pathname),
    () => defaultLocale,
  );

  useEffect(() => {
    console.error(error);
  }, [error]);

  const dictionary = getDictionary(locale);
  const homeHref = getLocalizedPath(locale, '/');
  const blogHref = getLocalizedPath(locale, '/blog');

  return (
    <html lang={locale}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
        }}
      >
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
      </body>
    </html>
  );
}
