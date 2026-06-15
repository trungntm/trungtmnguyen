export type SearchDocument = {
  id: string;
  locale: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  publishedAt: string;
  readingTime?: string;
  content: string;
};

export type SearchRenderDocument = {
  id: string;
  locale: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  publishedAt: string;
  readingTime?: string;
};
