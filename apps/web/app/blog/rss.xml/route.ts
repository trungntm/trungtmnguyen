import { NextResponse } from 'next/server';

import { defaultLocale } from '@/lib/i18n';

export function GET(request: Request) {
  return NextResponse.redirect(new URL(`/${defaultLocale}/rss.xml`, request.url), 308);
}
