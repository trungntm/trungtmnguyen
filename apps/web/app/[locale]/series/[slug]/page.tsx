import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { SeriesPostListItem } from '@/components/blog/series-post-list-item';
import { BlogDetailTranslationSync } from '@/components/layout/blog-detail-translation-sync';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { BaseLink } from '@/components/ui/links';
import { getPublishedSeriesBySlug } from '@/features/cms-blog/api/cms-blog-api';
import type { PublicSeriesDetailDto } from '@/features/cms-blog/types';
import { getSeriesPostCountLabel, getDictionary, isValidLocale, type Locale } from '@/lib/i18n';
import { buildAbsoluteUrl, getOpenGraphLocale, resolveAbsoluteUrl } from '@/lib/seo';
import { getSeriesStructuredData } from '@/lib/series';

type LocalizedSeriesDetailPageProps = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

function resolveCmsSeriesCoverImage(coverImageUrl: string | null) {
  if (!coverImageUrl) {
    return undefined;
  }

  return [resolveAbsoluteUrl(coverImageUrl)];
}

function getCmsSeriesSeo(series: PublicSeriesDetailDto) {
  const description = series.description ?? '';
  const canonical = buildAbsoluteUrl(series.url);
  const images = resolveCmsSeriesCoverImage(series.coverImageUrl);
  const languages = Object.fromEntries(
    series.translations.map((translation) => [translation.locale, buildAbsoluteUrl(translation.url)]),
  ) as Partial<Record<Locale, string>>;

  return {
    title: series.title,
    description,
    canonical,
    images,
    languages,
  };
}

export async function generateMetadata({
  params,
}: LocalizedSeriesDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  try {
    const series = await getPublishedSeriesBySlug({ locale, slug });

    if (!series) {
      return {};
    }

    const { title, description, canonical, images, languages } = getCmsSeriesSeo(series);

    return {
      title,
      description,
      alternates: {
        canonical,
        languages,
      },
      openGraph: {
        type: 'website',
        locale: getOpenGraphLocale(series.locale),
        url: canonical,
        title,
        description,
        ...(images ? { images } : {}),
      },
      twitter: {
        card: series.coverImageUrl ? 'summary_large_image' : 'summary',
        title,
        description,
        ...(images ? { images } : {}),
      },
    };
  } catch {
    return {};
  }
}

export default async function LocalizedSeriesDetailPage({
  params,
}: LocalizedSeriesDetailPageProps) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const series = await getPublishedSeriesBySlug({ locale, slug });

  if (!series) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const { canonical } = getCmsSeriesSeo(series);
  const structuredData = getSeriesStructuredData(series, canonical);

  return (
    <article className="page-container px-4 py-14 md:px-6 md:py-18">
      <BlogDetailTranslationSync translations={series.translations} />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        type="application/ld+json"
      />
      <div className="mx-auto max-w-295 space-y-10">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BaseLink
              className="text-sm font-semibold text-muted transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
              href="/series"
            >
              {dictionary.seriesPage.backToSeries}
            </BaseLink>
            <LanguageSwitcher locale={locale} postTranslations={series.translations} />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              {series.title}
            </h1>
            {series.description ? (
              <p className="max-w-3xl text-lg leading-8 text-muted md:text-xl">
                {series.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span>{getSeriesPostCountLabel(dictionary, series.postCount)}</span>
          </div>

          {series.coverImageUrl ? (
            <div className="glass-card relative aspect-[16/9] overflow-hidden rounded-[2rem]">
              <Image
                alt={series.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                src={series.coverImageUrl}
                unoptimized
              />
            </div>
          ) : null}
        </header>

        <section className="space-y-6">
          {series.posts.length > 0 ? (
            <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {series.posts.map((post, index) => (
                <li key={post.id} className="list-none">
                  <SeriesPostListItem
                    dictionary={dictionary}
                    index={index}
                    locale={locale}
                    post={post}
                  />
                </li>
              ))}
            </ol>
          ) : (
            <div className="glass-card rounded-[1.75rem] p-8">
              <p className="text-sm text-muted">{dictionary.seriesPage.emptyDescription}</p>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
