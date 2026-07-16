import { ImageResponse } from 'next/og';

import { OgBackground } from '@/features/open-graph/components/og-background';
import { OgBrandFooter } from '@/features/open-graph/components/og-brand-footer';
import { OgStatusBadge } from '@/features/open-graph/components/og-status-badge';
import { getFavicon } from '@/features/open-graph/og-assets';
import { getOgFonts } from '@/features/open-graph/og-fonts';
import { type Locale, isValidLocale } from '@/lib/i18n';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const content = {
  vi: {
    badge: 'Xin chào, mình là Trung',
    title: 'Những gì mình học được khi làm phần mềm.',
    supporting:
      'Một góc nhỏ để chia sẻ những điều mình thấy thú vị trên hành trình trở thành một software engineer tốt hơn.',
  },
  en: {
    badge: "Hi, I'm Trung",
    title: "Things I've learned while building software.",
    supporting:
      'A place where I share things I find interesting on my journey to becoming a better software engineer.',
  },
};

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Image({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? (localeParam as Locale) : 'en';
  const [fonts, faviconSrc] = await Promise.all([getOgFonts(), getFavicon()]);
  const text = content[locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          fontFamily: '"Space Grotesk"',
        }}
      >
        <OgBackground />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <OgStatusBadge label={text.badge} />
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                lineHeight: 1.2,
                fontWeight: 700,
                color: '#f8fafc', // slate-50
                margin: 0,
                letterSpacing: '-0.02em',
                maxWidth: '960px',
              }}
            >
              {text.title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                lineHeight: 1.5,
                color: '#94a3b8', // slate-400
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {text.supporting}
            </p>
          </div>
          
          <OgBrandFooter faviconSize={56} faviconSrc={faviconSrc} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
