import { permanentRedirect } from 'next/navigation';

import { defaultLocale } from '@/lib/i18n';

export default function LegacyAboutPage() {
  permanentRedirect(`/${defaultLocale}/about`);
}
