import { permanentRedirect } from 'next/navigation';

import { defaultLocale } from '@/lib/i18n';

export default function PublicSeriesIndexPage() {
  permanentRedirect(`/${defaultLocale}/series`);
}
