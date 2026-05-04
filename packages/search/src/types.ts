export type SearchDocument = {
  id: string;
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
  title: string;
  description: string;
  url: string;
  tags: string[];
  publishedAt: string;
  readingTime?: string;
};
