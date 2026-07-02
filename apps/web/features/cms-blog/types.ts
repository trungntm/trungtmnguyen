export type BlogLocale = 'vi' | 'en';

export type BlogTagDto = {
  id: string;
  code: string;
  name: string;
};

export type PublicPostListItemDto = {
  id: string;
  locale: BlogLocale;
  slug: string;
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

export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};
