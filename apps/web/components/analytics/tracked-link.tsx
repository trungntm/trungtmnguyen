'use client';

import type { ReactNode, MouseEvent } from 'react';
import type { ComponentProps } from 'react';

import type { AnalyticsEventName, AnalyticsEventParameters } from '@trungtmnguyen/analytics';
import { trackEvent } from '@trungtmnguyen/analytics/client';

import { BaseLink } from '@/components/ui/links';

type BaseLinkProps = ComponentProps<typeof BaseLink>;

type TrackedLinkProps<TEventName extends AnalyticsEventName> = {
  eventName: TEventName;
  eventParameters: AnalyticsEventParameters[TEventName];
  href: BaseLinkProps['href'];
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  title?: string;
};

export function TrackedLink<TEventName extends AnalyticsEventName>({
  eventName,
  eventParameters,
  href,
  children,
  className,
  ariaLabel,
  title,
}: TrackedLinkProps<TEventName>) {
  const handleClick = (_event: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, eventParameters);
  };

  return (
    <BaseLink aria-label={ariaLabel} className={className} href={href} title={title} onClick={handleClick}>
      {children}
    </BaseLink>
  );
}
