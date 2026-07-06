export type BlogPreview = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  publishedAt: string;
  tags: string[];
  thumbnail?: string | null | undefined;
  cover?: string | null | undefined;
  coverImageUrl?: string | null | undefined;
  author?: string | null | undefined;
  readingTime?: {
    text: string;
  } | null | undefined;
};
