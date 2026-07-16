import { permanentRedirect } from 'next/navigation';

import { defaultLocale } from '@/lib/i18n';

export const revalidate = 60;

export async function GET() {
  permanentRedirect(`/${defaultLocale}/rss.xml`);
}
