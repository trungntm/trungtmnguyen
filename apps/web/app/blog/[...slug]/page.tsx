import type { Metadata, Route } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { getPublishedPostBySlug } from '@/features/cms-blog/api/cms-blog-api';
import { getLegacyBlogRedirect } from '@/lib/blogs';
import { isValidLocale, type Locale } from '@/lib/i18n';

type LegacyBlogDetailRedirectPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

function getCmsBlogParams(slugSegments: string[]) {
  if (slugSegments.length !== 2) {
    return null;
  }

  const [locale, slug] = slugSegments;

  if (!locale || !slug || !isValidLocale(locale)) {
    return null;
  }

  return {
    locale,
    slug,
  } satisfies {
    locale: Locale;
    slug: string;
  };
}

export async function generateMetadata(_: LegacyBlogDetailRedirectPageProps): Promise<Metadata> {
  return {};
}

export default async function LegacyBlogDetailRedirectPage({ params }: LegacyBlogDetailRedirectPageProps) {
  const { slug } = await params;
  const cmsParams = getCmsBlogParams(slug);

  if (cmsParams) {
    const post = await getPublishedPostBySlug(cmsParams);

    if (!post) {
      notFound();
    }

    permanentRedirect(post.url as Route);
  }

  const legacySlug = slug.join('/');
  const redirectPath = getLegacyBlogRedirect(legacySlug);

  if (!redirectPath) {
    notFound();
  }

  permanentRedirect(redirectPath as Route);
}
