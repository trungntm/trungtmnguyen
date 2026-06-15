import type { Metadata } from 'next';

import { CoreTopics } from '@/components/home/core-topics';
import { EngineeringPhilosophy } from '@/components/home/engineering-philosophy';
import { HomeHero } from '@/components/home/home-hero';
import { LatestNotes } from '@/components/home/latest-notes';
import { getPublishedBlogs } from '@/lib/blogs';
import { getDictionary, type Locale } from '@/lib/i18n';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';

type LocalizedHomePageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: LocalizedHomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  const canonicalPath = `/${locale}`;

  return {
    title: dictionary.metadata.homeTitle,
    description: dictionary.metadata.siteDescription,
    alternates: {
      canonical: buildAbsoluteUrl(canonicalPath),
      languages: {
        vi: buildAbsoluteUrl('/vi'),
        en: buildAbsoluteUrl('/en'),
      },
    },
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(locale),
      url: buildAbsoluteUrl(canonicalPath),
      title: dictionary.metadata.siteTitle,
      description: dictionary.metadata.siteDescription,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: dictionary.metadata.siteTitle,
      description: dictionary.metadata.siteDescription,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function LocalizedHomePage({ params }: LocalizedHomePageProps) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  const latestBlogs = getPublishedBlogs(locale).slice(0, 3);

  return (
    <div className="page-shell">
      <div className="glow-background pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-background pointer-events-none absolute inset-0 -z-10" />

      <div className="space-y-16 pb-20 pt-6 md:space-y-24 md:pb-24 md:pt-8">
        <HomeHero dictionary={dictionary} />
        <LatestNotes blogs={latestBlogs} dictionary={dictionary} locale={locale} />
        <CoreTopics dictionary={dictionary} />
        <EngineeringPhilosophy dictionary={dictionary} />
      </div>
    </div>
  );
}
