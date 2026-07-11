import type { Route } from 'next';

import type { PublicSeriesDetailDto, PublicSeriesListItemDto } from '@/features/cms-blog/types';
import { formatMessage, type Dictionary } from '@/lib/i18n';
import { buildAbsoluteUrl } from '@/lib/seo';

import type { SeriesPreview } from '@/components/blog/series-preview';

export function parseSeriesPageParam(page: string | string[] | undefined) {
  const value = Array.isArray(page) ? page[0] : page;
  const parsed = Number.parseInt(value ?? '1', 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export function mapCmsSeriesToSeriesCardViewModel(series: PublicSeriesListItemDto): SeriesPreview {
  return {
    id: series.id,
    url: series.url,
    title: series.title,
    description: series.description,
    coverImageUrl: series.coverImageUrl,
    postCount: series.postCount,
    publishedAt: series.publishedAt,
  };
}

export function buildSeriesPaginationHref(locale: string, page: number) {
  return (page <= 1 ? `/${locale}/series` : `/${locale}/series?page=${page}`) as Route;
}

export function getSeriesPaginationLabel(dictionary: Dictionary, currentPage: number, totalPages: number) {
  return formatMessage(dictionary.seriesPage.paginationLabel, {
    current: currentPage,
    total: totalPages,
  });
}

export function getSeriesStructuredData(series: PublicSeriesDetailDto, canonical: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: series.title,
    description: series.description ?? undefined,
    url: canonical,
    inLanguage: series.locale,
    datePublished: series.publishedAt,
    dateModified: series.updatedAt,
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: series.posts.length,
        itemListElement: series.posts.map((post, index) => ({
          '@type': 'ListItem',
          position: post.seriesOrder ?? index + 1,
          url: buildAbsoluteUrl(post.url),
          name: post.title,
        })),
    },
  };
}
