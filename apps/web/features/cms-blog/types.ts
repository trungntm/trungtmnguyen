export type BlogLocale = 'vi' | 'en';

export type BlogTagDto = {
  id: string;
  code: string;
  name: string;
};

export type PublicPostTranslationLinkDto = {
  locale: BlogLocale;
  slug: string;
  url: string;
  title: string;
};

export type PublicSeriesTranslationLinkDto = {
  locale: BlogLocale;
  slug: string;
  url: string;
  title: string;
};

export type PublicPostListItemDto = {
  id: string;
  locale: BlogLocale;
  slug: string;
  url: string;
  title: string;
  description: string | null;
  coverImageObjectKey: string | null;
  coverImageUrl: string | null;
  tags: BlogTagDto[];
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicPostDetailDto = {
  id: string;
  locale: BlogLocale;
  slug: string;
  url: string;
  translations: PublicPostTranslationLinkDto[];
  title: string;
  description: string | null;
  contentMd: string;
  seoTitle: string | null;
  seoDescription: string | null;
  coverImageObjectKey: string | null;
  coverImageUrl: string | null;
  tags: BlogTagDto[];
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ListPublishedPostsResponseDto = {
  items: PublicPostListItemDto[];
  total: number;
  page: number;
  pageSize: number;
};

export type PublicSeriesListItemDto = {
  id: string;
  locale: BlogLocale;
  slug: string;
  url: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  postCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicSeriesPostDto = {
  id: string;
  locale: BlogLocale;
  slug: string;
  url: string;
  title: string;
  description: string | null;
  coverImageObjectKey: string | null;
  coverImageUrl: string | null;
  tags: BlogTagDto[];
  featured: boolean;
  seriesOrder: number | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicSeriesDetailDto = {
  id: string;
  locale: BlogLocale;
  slug: string;
  url: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  translations: PublicSeriesTranslationLinkDto[];
  posts: PublicSeriesPostDto[];
  postCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ListPublishedSeriesResponseDto = {
  items: PublicSeriesListItemDto[];
  total: number;
  page: number;
  pageSize: number;
};

export type SeriesListItem = ListPublishedSeriesResponseDto['items'][number];

export type SeriesListResult = ListPublishedSeriesResponseDto;

export type SeriesDetail = PublicSeriesDetailDto;

export type SeriesPost = PublicSeriesPostDto;

export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};
