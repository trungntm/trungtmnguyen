import type { Metadata, Route } from 'next';
import Link from 'next/link';

import { BlogCard } from '@/components/blog/blog-card';
import { getAllTags, getPublishedBlogs, getTagUrl } from '@/lib/blogs';
import { getDictionary, type Locale } from '@/lib/i18n';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';

type LocalizedBlogPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: LocalizedBlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  const canonicalPath = `/${locale}/blog`;

  return {
    title: dictionary.metadata.blogTitle,
    description: dictionary.metadata.blogDescription,
    alternates: {
      canonical: buildAbsoluteUrl(canonicalPath),
      languages: {
        vi: buildAbsoluteUrl('/vi/blog'),
        en: buildAbsoluteUrl('/en/blog'),
      },
    },
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(locale),
      url: buildAbsoluteUrl(canonicalPath),
      title: dictionary.metadata.blogTitle,
      description: dictionary.metadata.blogDescription,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: dictionary.metadata.blogTitle,
      description: dictionary.metadata.blogDescription,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function LocalizedBlogPage({ params }: LocalizedBlogPageProps) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  const blogs = getPublishedBlogs(locale);
  const tags = getAllTags(locale);

  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-10">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {dictionary.blogPage.heading}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            {dictionary.blogPage.description}
          </p>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  className="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium tracking-[0.18em] text-muted uppercase transition-colors hover:border-primary/35 hover:text-primary focus-visible:border-primary/35 focus-visible:text-primary focus-visible:outline-none"
                  href={getTagUrl(locale, tag.slug) as Route}
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          ) : null}
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
              {dictionary.blogPage.emptyLabel}
            </p>
            <h2 className="mt-4 text-2xl font-semibold">{dictionary.blogPage.emptyTitle}</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              {dictionary.blogPage.emptyDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
