import { ImageResponse } from 'next/og';

import { getCachedPublishedPostBySlug } from '@/features/cms-blog/api/cms-blog-api';
import { OgBackground } from '@/features/open-graph/components/og-background';
import { OgBrandFooter } from '@/features/open-graph/components/og-brand-footer';
import { getFavicon } from '@/features/open-graph/og-assets';
import { getOgFonts } from '@/features/open-graph/og-fonts';
import { type Locale, isValidLocale } from '@/lib/i18n';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const fallbackEyebrow = {
  vi: 'ENGINEERING NOTES',
  en: 'ENGINEERING NOTES',
};

const fallbackTitle = {
  vi: 'Những gì mình học được khi làm phần mềm.',
  en: "Things I've learned while building software.",
};

function getTitleFontSize(title: string) {
  if (title.length <= 40) return '72px';
  if (title.length <= 70) return '60px';
  return '48px';
}

function truncateDesc(desc: string, maxLen = 120) {
  if (desc.length <= maxLen) return desc;
  return desc.substring(0, maxLen).trim() + '...';
}

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function Image({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = isValidLocale(localeParam) ? (localeParam as Locale) : 'en';
  const [fonts, faviconSrc] = await Promise.all([getOgFonts(), getFavicon()]);

  try {
    const post = await getCachedPublishedPostBySlug(locale, slug);

    if (!post) {
      throw new Error(`Post not found: ${slug}`);
    }

    const titleFontSize = getTitleFontSize(post.title);
    const tags = post.tags.slice(0, 3);
    const eyebrowText = fallbackEyebrow[locale]; // Extend this if series is added later

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
            <div
              style={{
                fontSize: '24px',
                color: '#38bdf8', // sky-400
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: '24px',
              }}
            >
              {eyebrowText}
            </div>

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
                  fontSize: titleFontSize,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: '#f8fafc', // slate-50
                  margin: 0,
                  letterSpacing: '-0.02em',
                  maxWidth: '960px',
                }}
              >
                {post.title}
              </h1>

              {post.description ? (
                <p
                  style={{
                    fontSize: '32px',
                    lineHeight: 1.5,
                    color: '#94a3b8', // slate-400
                    margin: 0,
                    maxWidth: '900px',
                  }}
                >
                  {truncateDesc(post.description)}
                </p>
              ) : null}
            </div>

            {tags.length > 0 ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    style={{
                      display: 'flex',
                      padding: '8px 16px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1', // slate-300
                      fontSize: '20px',
                      fontWeight: 500,
                    }}
                  >
                    #{tag.name}
                  </div>
                ))}
              </div>
            ) : null}

            <OgBrandFooter faviconSize={44} faviconSrc={faviconSrc} />
          </div>
        </div>
      ),
      {
        ...size,
        fonts,
      },
    );
  } catch (error) {
    console.error(`[OpenGraph] Failed to generate blog OG image for ${locale}/${slug}:`, error);

    // Fallback Image
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
            <div
              style={{
                fontSize: '24px',
                color: '#38bdf8', // sky-400
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: '24px',
              }}
            >
              {fallbackEyebrow[locale]}
            </div>

            <h1
              style={{
                fontSize: '72px',
                lineHeight: 1.2,
                fontWeight: 700,
                color: '#f8fafc', // slate-50
                margin: 0,
                marginBottom: '24px',
                letterSpacing: '-0.02em',
              }}
            >
              {fallbackTitle[locale]}
            </h1>
            <OgBrandFooter faviconSize={44} faviconSrc={faviconSrc} />
          </div>
        </div>
      ),
      {
        ...size,
        fonts,
      },
    );
  }
}
