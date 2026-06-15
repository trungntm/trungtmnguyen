import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { defaultLocale } from '@/lib/i18n';
import { getOpenGraphLocale, siteConfig } from '@/lib/seo';

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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: getOpenGraphLocale(defaultLocale),
    url: siteConfig.url,
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
  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning lang={defaultLocale}>
      <body className={`${spaceGrotesk.variable} min-h-screen antialiased`}>
        <ThemeProvider disableTransitionOnChange>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
