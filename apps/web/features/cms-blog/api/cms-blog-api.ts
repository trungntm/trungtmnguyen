import { cache } from 'react';
import 'server-only';

import { z } from 'zod';

import type {
  ApiError,
  ApiSuccess,
  BlogLocale,
  ListPublishedSeriesResponseDto,
  ListPublishedPostsResponseDto,
  PublicPostDetailDto,
  PublicPostListItemDto,
  PublicPostTranslationLinkDto,
  PublicSeriesDetailDto,
  PublicSeriesListItemDto,
  PublicSeriesPostDto,
  PublicSeriesTranslationLinkDto,
} from '@/features/cms-blog/types';

const blogLocaleSchema = z.enum(['vi', 'en']);

const blogTagDtoSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
});

const publicPostTranslationLinkDtoSchema = z.object({
  locale: blogLocaleSchema,
  slug: z.string(),
  url: z.string(),
  title: z.string(),
});

const publicPostListItemDtoSchema = z.object({
  id: z.string(),
  locale: blogLocaleSchema,
  slug: z.string(),
  url: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  coverImageObjectKey: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  tags: z.array(blogTagDtoSchema),
  featured: z.boolean(),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const publicPostDetailDtoSchema = z.object({
  id: z.string(),
  locale: blogLocaleSchema,
  slug: z.string(),
  url: z.string(),
  translations: z.array(publicPostTranslationLinkDtoSchema).default([]),
  title: z.string(),
  description: z.string().nullable(),
  contentMd: z.string(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  coverImageObjectKey: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  tags: z.array(blogTagDtoSchema),
  featured: z.boolean(),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const publicSeriesTranslationLinkDtoSchema = z.object({
  locale: blogLocaleSchema,
  slug: z.string(),
  url: z.string(),
  title: z.string(),
});

const publicSeriesPostDtoSchema = z.object({
  id: z.string(),
  locale: blogLocaleSchema,
  slug: z.string(),
  url: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  coverImageObjectKey: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  tags: z.array(blogTagDtoSchema),
  featured: z.boolean(),
  seriesOrder: z.number().nullable(),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const publicSeriesListItemDtoSchema = z.object({
  id: z.string(),
  locale: blogLocaleSchema,
  slug: z.string(),
  url: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  postCount: z.number(),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const publicSeriesDetailDtoSchema = z.object({
  id: z.string(),
  locale: blogLocaleSchema,
  slug: z.string(),
  url: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  translations: z.array(publicSeriesTranslationLinkDtoSchema).default([]),
  posts: z.array(publicSeriesPostDtoSchema),
  postCount: z.number(),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const listPublishedPostsResponseDtoSchema = z.object({
  items: z.array(publicPostListItemDtoSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

const listPublishedSeriesResponseDtoSchema = z.object({
  items: z.array(publicSeriesListItemDtoSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

type CmsApiErrorCode = 'BLOG_NOT_FOUND' | 'BLOG_VALIDATION_ERROR' | 'INTERNAL_SERVER_ERROR';

type GetPublishedPostsInput = {
  locale?: BlogLocale;
  page?: number;
  pageSize?: number;
  tag?: string;
};

type GetPublishedPostBySlugInput = {
  locale: BlogLocale;
  slug: string;
};

type GetPublishedSeriesInput = {
  locale: BlogLocale;
  page?: number;
  pageSize?: number;
};

type GetPublishedSeriesBySlugInput = {
  locale: BlogLocale;
  slug: string;
};

export class CmsBlogApiError extends Error {
  code: string;

  status: number;

  constructor(message: string, options: { code: string; status: number }) {
    super(message);
    this.name = 'CmsBlogApiError';
    this.code = options.code;
    this.status = options.status;
  }
}

function getCmsBaseUrl() {
  const baseUrl = process.env.CMS_BASE_URL?.trim();

  if (!baseUrl) {
    throw new CmsBlogApiError('Missing CMS_BASE_URL environment variable.', {
      code: 'CMS_BASE_URL_MISSING',
      status: 500,
    });
  }

  return baseUrl.replace(/\/+$/, '');
}

function buildCmsUrl(pathname: string, searchParams?: URLSearchParams) {
  const url = new URL(`${getCmsBaseUrl()}${pathname}`);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  return url;
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    throw new CmsBlogApiError('CMS API returned an invalid JSON response.', {
      code: 'CMS_INVALID_JSON',
      status: response.status,
    });
  }
}

function parseApiError(payload: unknown): ApiError | null {
  const parsed = apiErrorSchema.safeParse(payload);
  return parsed.success ? (parsed.data as ApiError) : null;
}

function parseApiSuccess<T>(
  payload: unknown,
  schema: z.ZodSchema<T>,
  endpoint: string,
): ApiSuccess<T> {
  const parsed = z.object({ data: schema }).safeParse(payload);

  if (!parsed.success) {
    throw new CmsBlogApiError(`CMS API returned an invalid payload for ${endpoint}.`, {
      code: 'CMS_INVALID_PAYLOAD',
      status: 502,
    });
  }

  return parsed.data as ApiSuccess<T>;
}

async function fetchCms(endpoint: string) {
  const response = await fetch(endpoint, {
    signal: AbortSignal.timeout(5000),
    next: {
      revalidate: 60,
    },
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    const apiError = parseApiError(payload);

    if (apiError) {
      throw new CmsBlogApiError(apiError.error.message, {
        code: apiError.error.code,
        status: response.status,
      });
    }

    throw new CmsBlogApiError(`CMS API request failed with status ${response.status}.`, {
      code: 'CMS_REQUEST_FAILED',
      status: response.status,
    });
  }

  return payload;
}

function normalizeListQuery(input?: GetPublishedPostsInput) {
  const searchParams = new URLSearchParams();

  if (input?.locale) {
    searchParams.set('locale', input.locale);
  }

  if (typeof input?.page === 'number') {
    searchParams.set('page', String(input.page));
  }

  if (typeof input?.pageSize === 'number') {
    searchParams.set('pageSize', String(input.pageSize));
  }

  if (input?.tag) {
    searchParams.set('tag', input.tag);
  }

  return searchParams;
}

function normalizeSeriesListQuery(input: GetPublishedSeriesInput) {
  const searchParams = new URLSearchParams({
    locale: input.locale,
  });

  if (typeof input.page === 'number') {
    searchParams.set('page', String(input.page));
  }

  if (typeof input.pageSize === 'number') {
    searchParams.set('pageSize', String(input.pageSize));
  }

  return searchParams;
}

function sortPublishedPosts<T extends PublicPostListItemDto | PublicPostDetailDto>(posts: T[]) {
  return [...posts].sort((left, right) => {
    const publishedDiff = Date.parse(right.publishedAt) - Date.parse(left.publishedAt);

    if (publishedDiff !== 0) {
      return publishedDiff;
    }

    return Date.parse(right.createdAt) - Date.parse(left.createdAt);
  });
}

function normalizeTranslations(
  post: PublicPostDetailDto,
): PublicPostTranslationLinkDto[] {
  const translations = post.translations.filter(
    (translation, index, items) =>
      items.findIndex((entry) => entry.locale === translation.locale) === index,
  );

  const hasCurrentLocale = translations.some((translation) => translation.locale === post.locale);

  if (hasCurrentLocale) {
    return translations;
  }

  return [
    ...translations,
    {
      locale: post.locale,
      slug: post.slug,
      url: post.url,
      title: post.title,
    },
  ];
}

function normalizeSeriesTranslations(
  series: PublicSeriesDetailDto,
): PublicSeriesTranslationLinkDto[] {
  const translations = series.translations.filter(
    (translation, index, items) =>
      items.findIndex((entry) => entry.locale === translation.locale) === index,
  );

  const hasCurrentLocale = translations.some((translation) => translation.locale === series.locale);

  if (hasCurrentLocale) {
    return translations;
  }

  return [
    ...translations,
    {
      locale: series.locale,
      slug: series.slug,
      url: series.url,
      title: series.title,
    },
  ];
}

function sortSeriesPosts(posts: PublicSeriesPostDto[]) {
  return [...posts]
    .map((post, index) => ({ post, index }))
    .sort((left, right) => {
      const leftOrder = left.post.seriesOrder;
      const rightOrder = right.post.seriesOrder;

      if (leftOrder === null && rightOrder === null) {
        return left.index - right.index;
      }

      if (leftOrder === null) {
        return 1;
      }

      if (rightOrder === null) {
        return -1;
      }

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.index - right.index;
    })
    .map(({ post }) => post);
}

type GetAllPublishedPostsInput = Omit<GetPublishedPostsInput, 'page' | 'pageSize'> & {
  pageSize?: number;
};

export async function getPublishedPosts(
  input?: GetPublishedPostsInput,
): Promise<ListPublishedPostsResponseDto> {
  try {
    const endpoint = buildCmsUrl('/api/public/blog/posts', normalizeListQuery(input)).toString();
    const payload = await fetchCms(endpoint);
    const result = parseApiSuccess(payload, listPublishedPostsResponseDtoSchema, endpoint).data;

    return {
      ...result,
      items: sortPublishedPosts(result.items),
    };
  } catch (error) {
    if (
      error instanceof CmsBlogApiError &&
      (error.code as CmsApiErrorCode) === 'BLOG_VALIDATION_ERROR'
    ) {
      return {
        items: [],
        total: 0,
        page: input?.page ?? 1,
        pageSize: input?.pageSize ?? 10,
      };
    }

    throw error;
  }
}

export async function getAllPublishedPosts(
  input?: GetAllPublishedPostsInput,
): Promise<PublicPostListItemDto[]> {
  const pageSize = input?.pageSize ?? 100;
  const firstPage = await getPublishedPosts({
    ...input,
    page: 1,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(firstPage.total / pageSize));

  if (totalPages === 1) {
    return firstPage.items;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getPublishedPosts({
        ...input,
        page: index + 2,
        pageSize,
      }),
    ),
  );

  return sortPublishedPosts([
    ...firstPage.items,
    ...remainingPages.flatMap((page) => page.items),
  ]);
}

export async function getPublishedPostBySlug(
  input: GetPublishedPostBySlugInput,
): Promise<PublicPostDetailDto | null> {
  const endpoint = buildCmsUrl(
    `/api/public/blog/posts/${encodeURIComponent(input.locale)}/${encodeURIComponent(input.slug)}`,
  ).toString();

  try {
    const payload = await fetchCms(endpoint);
    const post = parseApiSuccess(payload, publicPostDetailDtoSchema, endpoint).data;

    return {
      ...post,
      translations: normalizeTranslations(post),
    };
  } catch (error) {
    if (error instanceof CmsBlogApiError && (error.code as CmsApiErrorCode) === 'BLOG_NOT_FOUND') {
      return null;
    }

    throw error;
  }
}

export const getCachedPublishedPostBySlug = cache(
  async (locale: BlogLocale, slug: string) => getPublishedPostBySlug({ locale, slug }),
);

type GetAllPublishedSeriesInput = Omit<GetPublishedSeriesInput, 'page' | 'pageSize'> & {
  pageSize?: number;
};

export async function getPublishedSeries(
  input: GetPublishedSeriesInput,
): Promise<ListPublishedSeriesResponseDto> {
  try {
    const endpoint = buildCmsUrl('/api/public/blog/series', normalizeSeriesListQuery(input)).toString();
    const payload = await fetchCms(endpoint);
    return parseApiSuccess(payload, listPublishedSeriesResponseDtoSchema, endpoint).data;
  } catch (error) {
    if (
      error instanceof CmsBlogApiError &&
      (error.code as CmsApiErrorCode) === 'BLOG_VALIDATION_ERROR'
    ) {
      return {
        items: [],
        total: 0,
        page: input.page ?? 1,
        pageSize: input.pageSize ?? 10,
      };
    }

    throw error;
  }
}

export async function getAllPublishedSeries(
  input: GetAllPublishedSeriesInput,
): Promise<PublicSeriesListItemDto[]> {
  const pageSize = input.pageSize ?? 100;
  const firstPage = await getPublishedSeries({
    ...input,
    page: 1,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(firstPage.total / pageSize));

  if (totalPages === 1) {
    return firstPage.items;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getPublishedSeries({
        ...input,
        page: index + 2,
        pageSize,
      }),
    ),
  );

  return [...firstPage.items, ...remainingPages.flatMap((page) => page.items)];
}

export async function getPublishedSeriesBySlug(
  input: GetPublishedSeriesBySlugInput,
): Promise<PublicSeriesDetailDto | null> {
  const endpoint = buildCmsUrl(
    `/api/public/blog/series/${encodeURIComponent(input.locale)}/${encodeURIComponent(input.slug)}`,
  ).toString();

  try {
    const payload = await fetchCms(endpoint);
    const series = parseApiSuccess(payload, publicSeriesDetailDtoSchema, endpoint).data;

    return {
      ...series,
      translations: normalizeSeriesTranslations(series),
      posts: sortSeriesPosts(series.posts),
    };
  } catch (error) {
    if (error instanceof CmsBlogApiError && (error.code as CmsApiErrorCode) === 'BLOG_NOT_FOUND') {
      return null;
    }

    throw error;
  }
}
