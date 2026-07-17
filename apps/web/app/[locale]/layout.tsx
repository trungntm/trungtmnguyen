import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { getDictionary, isValidLocale, locales } from '@/lib/i18n';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';

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

  const dictionary = getDictionary(locale);

  return {
    title: {
      default: dictionary.metadata.siteTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: dictionary.metadata.siteDescription,
    openGraph: {
      title: dictionary.metadata.siteTitle,
      description: dictionary.metadata.siteDescription,
      locale: getOpenGraphLocale(locale),
    },
    twitter: {
      title: dictionary.metadata.siteTitle,
      description: dictionary.metadata.siteDescription,
    },
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
