'use client';

import type { Route } from 'next';
import Link from 'next/link';
import type { ComponentProps } from 'react';

import { useLocale } from '@/components/i18n/locale-provider';
import { getLocalizedPath, isValidLocale } from '@/lib/i18n';

type BaseLinkProps = ComponentProps<typeof Link>;

function isExternalHref(href: string) {
  return (
    /^(?:[a-z]+:)?\/\//i.test(href) ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  );
}

function localizeHref(href: string, locale: ReturnType<typeof useLocale>) {
  if (!href || isExternalHref(href)) {
    return href;
  }

  const segments = href.split('/').filter(Boolean);

  if (segments[0] && isValidLocale(segments[0])) {
    return href;
  }

  return getLocalizedPath(locale, href);
}

export function BaseLink({ href, ...props }: BaseLinkProps) {
  const locale = useLocale();

  if (typeof href === 'string') {
    return <Link {...props} href={localizeHref(href, locale) as Route} />;
  }

  return <Link {...props} href={href} />;
}
