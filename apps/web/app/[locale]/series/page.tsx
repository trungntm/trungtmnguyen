import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SeriesCard } from '@/components/blog/series-card';
import { Pagination } from '@/components/ui/pagination';
import { getPublishedSeries } from '@/features/cms-blog/api/cms-blog-api';
import { getDictionary, isValidLocale } from '@/lib/i18n';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';
import {
  buildSeriesPaginationHref,
  getSeriesPaginationLabel,
  mapCmsSeriesToSeriesCardViewModel,
  parseSeriesPageParam,
} from '@/lib/series';

const SERIES_PAGE_SIZE = 9;

type LocalizedSeriesPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

export async function generateMetadata({ params }: LocalizedSeriesPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);
  const canonicalPath = `/${locale}/series`;

  return {
    title: dictionary.metadata.seriesTitle,
    description: dictionary.metadata.seriesDescription,
    alternates: {
      canonical: buildAbsoluteUrl(canonicalPath),
      languages: {
        vi: buildAbsoluteUrl('/vi/series'),
        en: buildAbsoluteUrl('/en/series'),
      },
    },
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(locale),
      url: buildAbsoluteUrl(canonicalPath),
      title: dictionary.metadata.seriesTitle,
      description: dictionary.metadata.seriesDescription,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: dictionary.metadata.seriesTitle,
      description: dictionary.metadata.seriesDescription,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function LocalizedSeriesPage({
  params,
  searchParams,
}: LocalizedSeriesPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const { page } = await searchParams;
  const currentPage = parseSeriesPageParam(page);
  const dictionary = getDictionary(locale);
  let response: Awaited<ReturnType<typeof getPublishedSeries>> | null = null;

  try {
    response = await getPublishedSeries({
      locale,
      page: currentPage,
      pageSize: SERIES_PAGE_SIZE,
    });
  } catch {
    response = null;
  }

  const seriesItems = response?.items.map(mapCmsSeriesToSeriesCardViewModel) ?? [];
  const totalPages = response ? Math.max(1, Math.ceil(response.total / response.pageSize)) : 1;

  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {dictionary.seriesPage.heading}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted">
              {dictionary.seriesPage.description}
            </p>
          </div>
          <Link
            className="text-sm font-semibold text-muted transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            href={`/${locale}/blog`}
          >
            {dictionary.common.blog}
          </Link>
        </div>

        {!response ? (
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <p className="text-sm font-medium tracking-[0.25em] text-muted uppercase">
              {dictionary.seriesPage.errorLabel}
            </p>
            <h2 className="mt-4 text-2xl font-semibold">{dictionary.seriesPage.errorTitle}</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              {dictionary.seriesPage.errorDescription}
            </p>
          </div>
        ) : seriesItems.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {seriesItems.map((series) => (
                <SeriesCard key={series.id} dictionary={dictionary} locale={locale} series={series} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              getHref={(nextPage) => buildSeriesPaginationHref(locale, nextPage)}
              label={getSeriesPaginationLabel(dictionary, currentPage, totalPages)}
              nextLabel={dictionary.common.next}
              previousLabel={dictionary.common.previous}
              totalPages={totalPages}
            />
          </>
        ) : (
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <p className="text-sm font-medium tracking-[0.25em] text-muted uppercase">
              {dictionary.seriesPage.emptyLabel}
            </p>
            <h2 className="mt-4 text-2xl font-semibold">{dictionary.seriesPage.emptyTitle}</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              {dictionary.seriesPage.emptyDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
