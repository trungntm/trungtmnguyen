import type { Locale } from '@/lib/i18n';

export const siteConfig = {
  name: 'Trung Nguyen',
  title: 'Trung Nguyen - Software Engineering Blog',
  description:
    'Practical notes about software architecture, Java, Spring Boot, Next.js, DevOps, and modern engineering.',
  url: 'https://yourdomain.com', // TODO replace
  ogImage: '/og/default.png',
  twitter: {
    card: 'summary_large_image',
  },
  avatarImage: '/images/avatar/avatar.jpg',
} as const;

export function buildAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString();
}

export function getOpenGraphLocale(locale: Locale) {
  return locale === 'vi' ? 'vi_VN' : 'en_US';
}
