'use client';

import type { Route } from 'next';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { MouseEvent } from 'react';

import { useLocale } from '@/components/i18n/locale-provider';
import { getLocalizedPath, isValidLocale } from '@/lib/i18n';
import { AnalyticsEventNames, trackEvent } from '@trungtmnguyen/analytics';

type BaseLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string | ComponentProps<typeof Link>['href'];
  trackExternal?: boolean;
};

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

export function BaseLink({ href, onClick, trackExternal = true, ...props }: BaseLinkProps) {
  const locale = useLocale();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented || !trackExternal || typeof href !== 'string') {
      return;
    }

    try {
      const destination = new URL(href, window.location.origin);
      const isExternalHttpLink =
        ['http:', 'https:'].includes(destination.protocol) &&
        destination.origin !== window.location.origin;

      if (isExternalHttpLink) {
        trackEvent(AnalyticsEventNames.clickExternalLink, {
          destinationHost: destination.hostname,
          locale,
        });
      }
    } catch {}
  }

  if (typeof href === 'string') {
    return <Link {...props} href={localizeHref(href, locale) as Route} onClick={handleClick} />;
  }

  return (
    <Link {...props} href={href as ComponentProps<typeof Link>['href']} onClick={handleClick} />
  );
}
