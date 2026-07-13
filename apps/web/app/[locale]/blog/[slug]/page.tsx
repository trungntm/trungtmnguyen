import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { BlogDetailTranslationSync } from '@/components/layout/blog-detail-translation-sync';
import { BlogPostViewTracker } from '@/components/analytics/blog-post-view-tracker';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { TagPill } from '@/components/blog/tag-pill';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import { getPublishedPostBySlug } from '@/features/cms-blog/api/cms-blog-api';
import { formatBlogDate } from '@/lib/blogs';
import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n';
import { calculateReadingTime } from '@/lib/reading-time';
import { buildAbsoluteUrl, getOpenGraphLocale, resolveAbsoluteUrl, siteConfig } from '@/lib/seo';
import { extractTocFromMarkdown } from '@/lib/toc';
import { cn } from '@/lib/utils';
import type { PublicPostDetailDto } from '@/features/cms-blog/types';

type LocalizedBlogDetailPageProps = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

function resolveCmsCoverImage(coverImageUrl: string | null) {
  if (!coverImageUrl) {
    return undefined;
  }

  return [resolveAbsoluteUrl(coverImageUrl)];
}

function getCmsPostSeo(post: PublicPostDetailDto) {
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.description ?? '';
  const canonical = buildAbsoluteUrl(post.url);
  const images = resolveCmsCoverImage(post.coverImageUrl);
  const languages = Object.fromEntries(
    post.translations.map((translation) => [translation.locale, buildAbsoluteUrl(translation.url)]),
  ) as Partial<Record<Locale, string>>;

  return {
    title,
    description,
    canonical,
    images,
    languages,
  };
}

export async function generateMetadata({ params }: LocalizedBlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  try {
    const post = await getPublishedPostBySlug({ locale, slug });

    if (!post) {
      return {};
    }

    const { title, description, canonical, images, languages } = getCmsPostSeo(post);

    return {
      title,
      description,
      alternates: {
        canonical,
        languages,
      },
      openGraph: {
        type: 'article',
        locale: getOpenGraphLocale(post.locale),
        url: canonical,
        title,
        description,
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        ...(images ? { images } : {}),
      },
      twitter: {
        card: post.coverImageUrl ? 'summary_large_image' : 'summary',
        title,
        description,
        ...(images ? { images } : {}),
      },
    };
  } catch {
    return {};
  }
}

export default async function LocalizedBlogDetailPage({ params }: LocalizedBlogDetailPageProps) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const post = await getPublishedPostBySlug({ locale, slug });

  if (!post) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const readingTime = calculateReadingTime(post.contentMd);
  const toc = extractTocFromMarkdown(post.contentMd);
  const hasToc = toc.length >= 2;
  const { title, description, canonical, images } = getCmsPostSeo(post);
  const blogPostingStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    ...(images ? { image: images } : {}),
    url: canonical,
    mainEntityOfPage: canonical,
    inLanguage: post.locale,
    keywords: post.tags.map((tag) => tag.name).join(', '),
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };

  return (
    <article className="page-container px-4 py-14 md:px-6 md:py-18">
      <BlogDetailTranslationSync translations={post.translations} />
      <BlogPostViewTracker locale={post.locale} postId={post.id} slug={post.slug} title={post.title} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingStructuredData),
        }}
      />
      <div className="mx-auto max-w-295 space-y-10">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagPill key={tag.id} tag={tag.name} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              {post.title}
            </h1>
            {post.description ? (
              <p className="text-lg leading-8 text-muted md:text-xl">
                {post.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span>{formatBlogDate(post.publishedAt, locale)}</span>
            <span>{readingTime.text}</span>
            {post.updatedAt !== post.publishedAt ? (
              <span>
                {dictionary.common.updatedAt} {formatBlogDate(post.updatedAt, locale)}
              </span>
            ) : null}
          </div>

          {post.coverImageUrl ? (
            <div className="glass-card relative aspect-[16/9] overflow-hidden rounded-[2rem]">
              <Image
                alt={post.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                src={post.coverImageUrl}
                unoptimized
              />
            </div>
          ) : null}
        </header>

        <div
          className={cn(
            'grid gap-6 xl:gap-10',
            hasToc && 'lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start',
          )}
        >
          <div className="space-y-6">
            <div className="lg:hidden">
              <TableOfContents items={toc} label={dictionary.common.onThisPage} />
            </div>

            <div className="glass-card rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
              <MDXRenderer className="blog-prose" slug={`${post.locale}-${post.slug}`} source={post.contentMd} />
            </div>
          </div>

          {hasToc ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <TableOfContents items={toc} label={dictionary.common.onThisPage} />
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}
