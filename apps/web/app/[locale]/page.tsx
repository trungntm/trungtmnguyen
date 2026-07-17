import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CoreTopics } from '@/components/home/core-topics';
import { EngineeringPhilosophy } from '@/components/home/engineering-philosophy';
import { HomeHero } from '@/components/home/home-hero';
import { LatestNotes } from '@/components/home/latest-notes';
import { LatestSeries } from '@/components/home/latest-series';
import { getPublishedPosts, getPublishedSeries } from '@/features/cms-blog/api/cms-blog-api';
import { mapCmsPostToPostCardViewModel } from '@/features/cms-blog/view-models';
import { getDictionary, isValidLocale } from '@/lib/i18n';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';
import { mapCmsSeriesToSeriesCardViewModel } from '@/lib/series';

type LocalizedHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: LocalizedHomePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

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
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: dictionary.metadata.siteTitle,
      description: dictionary.metadata.siteDescription,
    },
  };
}

export default async function LocalizedHomePage({ params }: LocalizedHomePageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  let latestBlogs: ReturnType<typeof mapCmsPostToPostCardViewModel>[] = [];
  let latestSeries: ReturnType<typeof mapCmsSeriesToSeriesCardViewModel>[] = [];

  try {
    const [cmsPosts, cmsSeries] = await Promise.all([
      getPublishedPosts({
        locale,
        page: 1,
        pageSize: 6,
      }),
      getPublishedSeries({
        locale,
        page: 1,
        pageSize: 3,
      }),
    ]);
    const featuredPosts = cmsPosts.items.filter((post) => post.featured);
    const latestPosts = cmsPosts.items.filter((post) => !post.featured);

    latestBlogs = [...featuredPosts, ...latestPosts].slice(0, 3).map(mapCmsPostToPostCardViewModel);
    latestSeries = cmsSeries.items.slice(0, 3).map(mapCmsSeriesToSeriesCardViewModel);
  } catch {
    latestBlogs = [];
    latestSeries = [];
  }

  const webSiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dictionary.metadata.siteTitle,
    url: buildAbsoluteUrl(`/${locale}`),
    description: dictionary.metadata.siteDescription,
    inLanguage: locale,
    publisher: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
      image: buildAbsoluteUrl(siteConfig.avatarImage),
    },
  };

  return (
    <div className="page-shell">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteStructuredData),
        }}
        type="application/ld+json"
      />
      <div className="glow-background pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-background pointer-events-none absolute inset-0 -z-10" />

      <div className="space-y-16 pb-20 pt-6 md:space-y-24 md:pb-24 md:pt-8">
        <HomeHero dictionary={dictionary} />
        <LatestNotes blogs={latestBlogs} dictionary={dictionary} disableTagLinks locale={locale} />
        <LatestSeries dictionary={dictionary} locale={locale} series={latestSeries} />
        <CoreTopics dictionary={dictionary} />
        <EngineeringPhilosophy dictionary={dictionary} />
      </div>
    </div>
  );
}
