import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { defaultLocale } from '@/lib/i18n';
import { getOpenGraphLocale, getSiteUrl, siteConfig } from '@/lib/seo';

import './globals.css';
import './prism.css';

const spaceGrotesk = localFont({
  src: [
    {
      path: './fonts/SpaceGrotesk-300.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/SpaceGrotesk-400.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SpaceGrotesk-500.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/SpaceGrotesk-600.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/SpaceGrotesk-700.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: getOpenGraphLocale(defaultLocale),
    url: getSiteUrl(),
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning lang={defaultLocale}>
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/favicons/favicon-16x16.png`}
      />
      <link rel="manifest" href={`${basePath}/favicons/site.webmanifest`} />
      <body suppressHydrationWarning className={`${spaceGrotesk.variable} min-h-screen antialiased`}>
        <ThemeProvider disableTransitionOnChange>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
