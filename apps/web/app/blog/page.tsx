import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';

import { BlogCard } from '@/components/blog/blog-card';
import { getPublishedPosts } from '@/features/cms-blog/api/cms-blog-api';
import { mapCmsPostToPostCardViewModel } from '@/features/cms-blog/view-models';
import { defaultLocale, getDictionary } from '@/lib/i18n';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';

export function generateMetadata(): Metadata {
  const dictionary = getDictionary(defaultLocale);
  const canonicalPath = '/blog';

  return {
    title: dictionary.metadata.blogTitle,
    description: dictionary.metadata.blogDescription,
    alternates: {
      canonical: buildAbsoluteUrl(canonicalPath),
    },
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(defaultLocale),
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

export default async function PublicBlogIndexPage() {
  const dictionary = getDictionary(defaultLocale);
  let blogs: ReturnType<typeof mapCmsPostToPostCardViewModel>[] = [];

  try {
    const response = await getPublishedPosts({
      locale: defaultLocale,
      page: 1,
      pageSize: 10,
    });

    blogs = response.items.map(mapCmsPostToPostCardViewModel);
  } catch {
    blogs = [];
  }

  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-10">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {dictionary.blogPage.heading}
            </h1>
            <Link
              className="text-sm font-semibold text-muted transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
              href={`/${defaultLocale}/series` as Route}
            >
              {dictionary.blogPage.seriesLink}
            </Link>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            {dictionary.blogPage.description}
          </p>
        </div>

        {blogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                dictionary={dictionary}
                disableTagLinks
                locale={defaultLocale}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-4xl p-8 md:p-10">
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
