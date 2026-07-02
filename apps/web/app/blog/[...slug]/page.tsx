import type { Metadata, Route } from 'next';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';

import { TableOfContents } from '@/components/blog/table-of-contents';
import { TagPill } from '@/components/blog/tag-pill';
import { CmsMarkdownRenderer } from '@/features/cms-blog/components/cms-markdown-renderer';
import { getPublishedPostBySlug } from '@/features/cms-blog/api/cms-blog-api';
import { formatBlogDate, getPostByLegacySlug } from '@/lib/blogs';
import { defaultLocale, getDictionary, isValidLocale, type Locale } from '@/lib/i18n';
import { calculateReadingTime } from '@/lib/reading-time';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';
import { extractTocFromMarkdown } from '@/lib/toc';
import { cn } from '@/lib/utils';

type PublicBlogDetailPageProps = {
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

function resolveCmsBlogImages(coverImageUrl: string | null) {
  if (!coverImageUrl) {
    return [buildAbsoluteUrl(siteConfig.ogImage)];
  }

  return [/^https?:\/\//i.test(coverImageUrl) ? coverImageUrl : buildAbsoluteUrl(coverImageUrl)];
}

export async function generateMetadata({ params }: PublicBlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cmsParams = getCmsBlogParams(slug);

  if (!cmsParams) {
    return {};
  }

  try {
    const post = await getPublishedPostBySlug(cmsParams);

    if (!post) {
      return {};
    }

    const title = post.seoTitle ?? post.title;
    const description = post.seoDescription ?? post.description ?? '';
    const canonicalPath = `/blog/${post.locale}/${post.slug}`;
    const images = resolveCmsBlogImages(post.coverImageUrl);

    return {
      title,
      description,
      alternates: {
        canonical: buildAbsoluteUrl(canonicalPath),
      },
      openGraph: {
        type: 'article',
        locale: getOpenGraphLocale(post.locale),
        url: buildAbsoluteUrl(canonicalPath),
        title,
        description,
        images,
        publishedTime: new Date(post.publishedAt).toISOString(),
      },
      twitter: {
        card: siteConfig.twitter.card,
        title,
        description,
        images,
      },
    };
  } catch {
    return {};
  }
}

export default async function PublicBlogDetailPage({ params }: PublicBlogDetailPageProps) {
  const { slug } = await params;
  const cmsParams = getCmsBlogParams(slug);

  if (cmsParams) {
    const post = await getPublishedPostBySlug(cmsParams);

    if (!post) {
      notFound();
    }

    const locale = cmsParams.locale;
    const dictionary = getDictionary(locale);
    const readingTime = calculateReadingTime(post.contentMd);
    const toc = extractTocFromMarkdown(post.contentMd);
    const hasToc = toc.length >= 2;

    return (
      <article className="page-container px-4 py-14 md:px-6 md:py-18">
        <div className="mx-auto max-w-[1180px] space-y-10">
          <header className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagPill key={tag.id} tag={tag.name} />
              ))}
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                {post.title}
              </h1>
              {post.description ? (
                <p className="max-w-3xl text-lg leading-8 text-muted md:text-xl">
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
                <TableOfContents items={toc} />
              </div>

              <div className="glass-card rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
                <CmsMarkdownRenderer
                  contentMd={post.contentMd}
                  slug={`${post.locale}-${post.slug}`}
                />
              </div>
            </div>

            {hasToc ? (
              <aside className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                  <TableOfContents items={toc} />
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  const legacySlug = slug.join('/');
  const blog = getPostByLegacySlug(legacySlug, defaultLocale);

  if (!blog) {
    notFound();
  }

  permanentRedirect(blog.url as Route);
}
