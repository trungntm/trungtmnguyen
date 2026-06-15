import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { TagLink } from '@/components/blog/tag-link';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import {
  type Blog,
  formatBlogDate,
  getAllBlogParams,
  getPostBySlug,
  getPostTranslation,
  getTranslationsByKey,
} from '@/lib/blogs';
import { getDictionary, type Locale, locales } from '@/lib/i18n';
import { resolvePublicAsset } from '@/lib/public-assets';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';
import { cn } from '@/lib/utils';

type BlogDetailPageProps = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

function resolveBlogImages(blog: Blog) {
  const image = blog.cover ?? blog.thumbnail ?? siteConfig.ogImage;
  return [new URL(image, siteConfig.url).toString()];
}

export async function generateStaticParams() {
  return getAllBlogParams().map(({ locale, slug }) => ({
    locale,
    slug,
  }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const blog = getPostBySlug(locale, slug);

  if (!blog) {
    return {};
  }

  const images = resolveBlogImages(blog);
  const translations = getTranslationsByKey(blog.translationKey);
  const canonicalBlog = getPostTranslation(blog, blog.canonicalLocale) ?? blog;
  const languages = Object.fromEntries(
    translations.map((translation) => [translation.locale, buildAbsoluteUrl(translation.url)]),
  );
  const canonicalUrl = buildAbsoluteUrl(canonicalBlog.url);
  const publishedTime = new Date(blog.publishedAt).toISOString();
  const updatedTime = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined;

  return {
    title: blog.title,
    description: blog.description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      type: 'article',
      locale: getOpenGraphLocale(locale),
      url: buildAbsoluteUrl(blog.url),
      title: blog.title,
      description: blog.description,
      images,
      publishedTime,
      ...(updatedTime ? { modifiedTime: updatedTime } : {}),
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: blog.title,
      description: blog.description,
      images,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;
  const blog = getPostBySlug(locale, slug);

  if (!blog) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const cover = resolvePublicAsset(blog.cover);
  const hasToc = blog.toc.length >= 2;
  const translationMap = Object.fromEntries(
    locales.map((targetLocale) => [
      targetLocale,
      getPostTranslation(blog, targetLocale)?.slug,
    ]),
  ) as Partial<Record<Locale, string>>;

  return (
    <article className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="mx-auto max-w-[1180px] space-y-10">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string) => (
                <TagLink key={tag} locale={locale} size="md" tag={tag} />
              ))}
            </div>
            <LanguageSwitcher
              locale={locale}
              postTranslations={translationMap}
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              {blog.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted md:text-xl">{blog.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span>{formatBlogDate(blog.publishedAt, locale)}</span>
            <span>{blog.author}</span>
            <span>{blog.readingTime.text}</span>
            {blog.updatedAt ? (
              <span>
                {dictionary.common.updatedAt} {formatBlogDate(blog.updatedAt, locale)}
              </span>
            ) : null}
          </div>

          {cover ? (
            <div className="glass-card relative aspect-[16/9] overflow-hidden rounded-[2rem]">
              <Image
                alt={blog.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                src={cover}
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
              <TableOfContents items={blog.toc} />
            </div>

            <div className="glass-card rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
              <MDXRenderer className="blog-prose" code={blog.mdx} />
            </div>
          </div>

          {hasToc ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <TableOfContents items={blog.toc} />
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}
