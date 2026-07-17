import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogCard } from '@/components/blog/blog-card';
import {
  getBlogsByTag,
  getTagData,
  getTagLabelFromSlug,
} from '@/lib/blog-data';
import { getDictionary, getTagCountLabel, isValidLocale } from '@/lib/i18n';
import { normalizeTag } from '@/lib/blogs';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';

type TagDetailPageProps = {
  params: Promise<{
    locale: string;
    tag: string;
  }>;
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: TagDetailPageProps): Promise<Metadata> {
  const { locale, tag } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const tagSlug = normalizeTag(tag);
  let tagLabel: Awaited<ReturnType<typeof getTagLabelFromSlug>>;
  let tagData: Awaited<ReturnType<typeof getTagData>>;
  let blogs: Awaited<ReturnType<typeof getBlogsByTag>>;

  try {
    [tagLabel, tagData, blogs] = await Promise.all([
      getTagLabelFromSlug(locale, tagSlug),
      getTagData(locale, tagSlug),
      getBlogsByTag(locale, tagSlug),
    ]);
  } catch {
    return {};
  }

  if (!tagLabel) {
    return {};
  }

  const dictionary = getDictionary(locale);
  const blogCount = tagData?.count ?? blogs.length;
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
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: `#${tagLabel}`,
      description,
    },
  };
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { locale, tag } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const tagSlug = normalizeTag(tag);
  let tagLabel: Awaited<ReturnType<typeof getTagLabelFromSlug>>;
  let blogs: Awaited<ReturnType<typeof getBlogsByTag>>;

  try {
    [tagLabel, blogs] = await Promise.all([
      getTagLabelFromSlug(locale, tagSlug),
      getBlogsByTag(locale, tagSlug),
    ]);
  } catch {
    notFound();
  }

  if (!tagLabel) {
    notFound();
  }

  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-10">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">#{tagLabel}</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            {getTagCountLabel(dictionary, blogs.length, tagLabel)}
          </p>
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
