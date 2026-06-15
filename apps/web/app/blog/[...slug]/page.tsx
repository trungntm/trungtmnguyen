import type { Route } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { defaultLocale } from '@/lib/i18n';
import { getPostByLegacySlug } from '@/lib/blogs';

type LegacyBlogDetailPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function LegacyBlogDetailPage({ params }: LegacyBlogDetailPageProps) {
  const { slug } = await params;
  const legacySlug = slug.join('/');
  const blog = getPostByLegacySlug(legacySlug, defaultLocale);

  if (!blog) {
    notFound();
  }

  permanentRedirect(blog.url as Route);
}
