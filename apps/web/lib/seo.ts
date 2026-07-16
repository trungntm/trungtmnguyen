import type { Locale } from '@/lib/i18n';

export const siteConfig = {
  name: 'Trung Nguyen',
  title: 'Trung Nguyen - Software Engineering',
  description:
    'Personal website where I share what I learn while building software, designing systems, and exploring modern technologies.',
  url: 'https://trungtmnguyen.com',
  ogImage: '/og/default.jpg',
  twitter: {
    card: 'summary_large_image',
  },
  avatarImage: '/images/avatar/avatar.jpg',
} as const;

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, '');
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || siteConfig.url;
}

export function getCanonicalSiteUrl() {
  return normalizeBaseUrl(getSiteUrl());
}

export function buildAbsoluteUrl(pathname: string) {
  return new URL(pathname, getCanonicalSiteUrl()).toString();
}

export function resolveAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : buildAbsoluteUrl(value);
}

export function getOpenGraphLocale(locale: Locale) {
  return locale === 'vi' ? 'vi_VN' : 'en_US';
}
