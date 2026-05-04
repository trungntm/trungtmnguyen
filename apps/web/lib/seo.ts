import type { Metadata } from 'next';

const DEFAULT_SITE_URL = 'http://localhost:3000';

export const siteConfig = {
  name: 'Trung Nguyen',
  title: 'Trung Nguyen - Software Engineering Blog',
  avatarImage: '/images/blogs/avatar/avatar.jpg',
  description:
    'Practical notes about software architecture, Java, Spring Boot, Next.js, DevOps, and modern engineering.',
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  },
};

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
};

function resolveUrl(path = '/') {
  return new URL(path, siteConfig.siteUrl);
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = '/',
}: CreateMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const url = resolveUrl(path);

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: siteConfig.name,
      title: pageTitle,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
    },
  };
}

export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    applicationName: siteConfig.name,
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      url: siteConfig.siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
    },
  };
}
