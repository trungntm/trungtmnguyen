import type { Metadata } from 'next';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { notFound } from 'next/navigation';

import { BlogDetailTranslationSync } from '@/components/layout/blog-detail-translation-sync';
import { BlogPostViewTracker } from '@/components/analytics/blog-post-view-tracker';
import { BlogShareActions } from '@/components/analytics/blog-share-actions';
import { TrackedBlogComments } from '@/components/analytics/tracked-blog-comments';
import { MobileTableOfContents } from '@/components/blog/mobile-table-of-contents';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { TagPill } from '@/components/blog/tag-pill';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import { getCachedPublishedPostBySlug } from '@/features/cms-blog/api/cms-blog-api';
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

export async function generateMetadata({
  params,
}: LocalizedBlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  try {
    const post = await getCachedPublishedPostBySlug(locale, slug);

    if (!post) {
      return {};
    }

    const { title, description, canonical, languages } = getCmsPostSeo(post);

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
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
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

  const post = await getCachedPublishedPostBySlug(locale, slug);

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
      '@type': 'Person',
      name: siteConfig.name,
    },
  };

  const breadcrumbListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dictionary.navigation.home,
        item: buildAbsoluteUrl(`/${locale}`),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dictionary.common.blog,
        item: buildAbsoluteUrl(`/${locale}/blog`),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: canonical,
      },
    ],
  };

  return (
    <div className="relative mx-auto w-full max-w-[100rem] px-4 py-14 md:px-6 md:py-18 xl:px-8">
      <BlogDetailTranslationSync translations={post.translations} />
      <BlogPostViewTracker
        locale={post.locale}
        postId={post.id}
        slug={post.slug}
        title={post.title}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogPostingStructuredData, breadcrumbListStructuredData]),
        }}
      />
      <div
        className={cn(
          'mx-auto w-full',
          hasToc &&
            'xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(51.25rem,56.25rem)_18rem] xl:gap-12',
        )}
      >
        {hasToc ? <div aria-hidden="true" className="hidden xl:block" /> : null}

        <article className="mx-auto min-w-0 w-full max-w-[69rem] space-y-10">
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
                <p className="text-lg leading-8 text-muted md:text-xl">{post.description}</p>
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

            <BlogShareActions
              copiedLabel={dictionary.common.copied}
              copyLabel={dictionary.common.copyLink}
              locale={post.locale}
              postId={post.id}
              shareLabel={dictionary.common.share}
              slug={post.slug}
              title={post.title}
              url={canonical}
            />

            {post.coverImageUrl ? (
              <div className="glass-card relative aspect-[16/9] overflow-hidden rounded-[2rem]">
                <OptimizedImage
                  alt={post.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 64rem, 100vw"
                  src={post.coverImageUrl}
                />
              </div>
            ) : null}
          </header>

          <div className="space-y-6">
            <div className="xl:hidden">
              <MobileTableOfContents items={toc} label={dictionary.common.tableOfContents} />
            </div>

            <div className="glass-card rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
              <MDXRenderer
                className="blog-prose"
                slug={`${post.locale}-${post.slug}`}
                source={post.contentMd}
              />
            </div>
          </div>

          <div className="mx-auto w-full max-w-4xl">
            <TrackedBlogComments
              apiBaseUrl={process.env.CMS_BASE_URL ?? ''}
              locale={locale}
              messages={dictionary.comments}
              postId={post.id}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
            />
          </div>
        </article>

        {hasToc ? (
          <aside
            aria-label={dictionary.common.onThisPage}
            className="sticky top-32 mt-32 hidden max-h-[calc(100vh-8rem)] self-start overflow-y-auto overscroll-contain [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin] xl:block"
          >
            <TableOfContents items={toc} label={dictionary.common.onThisPage} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
