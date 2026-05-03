import { allPages } from 'content-collections';

export type Page = (typeof allPages)[number];

function normalizeSlug(slug: string) {
  return slug.replace(/^\/+|\/+$/g, '');
}

export function getPageBySlug(slug: string) {
  const normalizedSlug = normalizeSlug(slug);
  return allPages.find((page) => page.slug === normalizedSlug) ?? null;
}

export function getAboutPage() {
  return getPageBySlug('about');
}
