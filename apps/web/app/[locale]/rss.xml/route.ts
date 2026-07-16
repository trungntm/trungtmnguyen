import { notFound } from 'next/navigation';

import { isValidLocale, type Locale } from '@/lib/i18n';
import { createRssFeed } from '@/lib/rss';

export const revalidate = 60;

type LocalizedRssRouteProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function GET(_: Request, { params }: LocalizedRssRouteProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return createRssFeed(locale as Locale);
}
