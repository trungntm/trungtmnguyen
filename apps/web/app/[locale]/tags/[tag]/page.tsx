import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogCard } from '@/components/blog/blog-card';
import {
  getAllTags,
  getBlogsByTag,
  getTagData,
  getTagLabelFromSlug,
  normalizeTag,
} from '@/lib/blogs';
import { getDictionary, getTagCountLabel, type Locale } from '@/lib/i18n';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';

type TagDetailPageProps = {
  params: Promise<{
    locale: Locale;
    tag: string;
  }>;
};

export async function generateStaticParams() {
  return (['vi', 'en'] as const).flatMap((locale) =>
    getAllTags(locale).map((tag) => ({
      locale,
      tag: tag.slug,
    })),
  );
}

export async function generateMetadata({ params }: TagDetailPageProps): Promise<Metadata> {
  const { locale, tag } = await params;
  const tagSlug = normalizeTag(tag);
  const tagLabel = getTagLabelFromSlug(locale, tagSlug);

  if (!tagLabel) {
    return {};
  }

  const dictionary = getDictionary(locale);
  const blogCount = getTagData(locale, tagSlug)?.count ?? getBlogsByTag(locale, tagSlug).length;
  const description = getTagCountLabel(dictionary, blogCount, tagLabel);
  const canonicalUrl = buildAbsoluteUrl(`/${locale}/tags/${tagSlug}`);

  return {
    title: `#${tagLabel}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(locale),
      url: canonicalUrl,
      title: `#${tagLabel}`,
      description,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: `#${tagLabel}`,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { locale, tag } = await params;
  const dictionary = getDictionary(locale);
  const tagSlug = normalizeTag(tag);
  const tagLabel = getTagLabelFromSlug(locale, tagSlug);

  if (!tagLabel) {
    notFound();
  }

  const blogs = getBlogsByTag(locale, tagSlug);

  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-10">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">#{tagLabel}</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">{getTagCountLabel(dictionary, blogs.length, tagLabel)}</p>
        </div>

        {blogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} dictionary={dictionary} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <p className="text-sm font-medium tracking-[0.25em] text-muted uppercase">
              {dictionary.tagsPage.noPublishedPosts}
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              {dictionary.tagsPage.noVisiblePostsTitle}
            </h2>
          </div>
        )}
      </div>
    </section>
  );
}
