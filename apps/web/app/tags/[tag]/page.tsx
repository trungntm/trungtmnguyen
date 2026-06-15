import { permanentRedirect } from 'next/navigation';

import { defaultLocale } from '@/lib/i18n';

type LegacyTagDetailPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export default async function LegacyTagDetailPage({ params }: LegacyTagDetailPageProps) {
  const { tag } = await params;
  permanentRedirect(`/${defaultLocale}/tags/${tag}`);
}
