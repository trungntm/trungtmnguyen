'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const ALLOWED_SEARCH_PARAMETERS = new Set(['page', 'ref', 'tag']);

type AnalyticsProps = {
  googleAnalyticsId: string | undefined;
  umamiScriptUrl: string | undefined;
  umamiWebsiteId: string | undefined;
};

function getGoogleConfig(googleAnalyticsId: string) {
  return `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
window.gtag('config', ${JSON.stringify(googleAnalyticsId)}, { send_page_view: false });
`;
}

function GooglePageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || typeof window.gtag !== 'function') return;

    const safeSearchParams = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (ALLOWED_SEARCH_PARAMETERS.has(key)) safeSearchParams.append(key, value);
    }

    const search = safeSearchParams.toString();
    const path = search ? `${pathname}?${search}` : pathname;
    if (lastPath.current === path) return;
    lastPath.current = path;

    let referrer: string | undefined;
    try {
      if (document.referrer) referrer = new URL(document.referrer).origin;
    } catch {}

    try {
      window.gtag('event', 'page_view', {
        page_location: new URL(path, window.location.origin).href,
        page_path: path,
        ...(referrer ? { page_referrer: referrer } : {}),
        ...(document.title ? { page_title: document.title } : {}),
      });
    } catch {}
  }, [pathname, searchParams]);

  return null;
}

export function Analytics({ googleAnalyticsId, umamiScriptUrl, umamiWebsiteId }: AnalyticsProps) {
  const gaId = googleAnalyticsId?.trim();
  const umamiScript = umamiScriptUrl?.trim();
  const umamiWebsite = umamiWebsiteId?.trim();

  return (
    <>
      {gaId ? (
        <>
          <script
            async
            id="google-analytics-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
          />
          <script
            dangerouslySetInnerHTML={{ __html: getGoogleConfig(gaId) }}
            id="google-analytics-config"
          />
          <Suspense fallback={null}>
            <GooglePageViewTracker />
          </Suspense>
        </>
      ) : null}

      {umamiScript && umamiWebsite ? (
        <script data-website-id={umamiWebsite} defer id="umami-analytics" src={umamiScript} />
      ) : null}
    </>
  );
}
