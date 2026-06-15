import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { isValidLocale, locales } from '@/lib/i18n';
import { buildAbsoluteUrl } from '@/lib/seo';

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleMetadataProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: LocaleMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  return {
    alternates: {
      types: {
        'application/rss+xml': buildAbsoluteUrl(`/${locale}/rss.xml`),
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return children;
}
