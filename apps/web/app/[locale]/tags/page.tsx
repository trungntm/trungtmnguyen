import type { Metadata, Route } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllTags } from '@/lib/blog-data';
import { getDictionary, isValidLocale } from '@/lib/i18n';
import { getTagUrl } from '@/lib/blogs';
import { buildAbsoluteUrl, getOpenGraphLocale, siteConfig } from '@/lib/seo';

type LocalizedTagsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: LocalizedTagsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);
  const canonicalPath = `/${locale}/tags`;

  return {
    title: dictionary.metadata.tagsTitle,
    description: dictionary.metadata.tagsDescription,
    alternates: {
      canonical: buildAbsoluteUrl(canonicalPath),
      languages: {
        vi: buildAbsoluteUrl('/vi/tags'),
        en: buildAbsoluteUrl('/en/tags'),
      },
    },
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(locale),
      url: buildAbsoluteUrl(canonicalPath),
      title: dictionary.metadata.tagsTitle,
      description: dictionary.metadata.tagsDescription,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: dictionary.metadata.tagsTitle,
      description: dictionary.metadata.tagsDescription,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function LocalizedTagsPage({ params }: LocalizedTagsPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  let tags: Awaited<ReturnType<typeof getAllTags>> = [];

  try {
    tags = await getAllTags(locale);
  } catch {
    tags = [];
  }

  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-10">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {dictionary.tagsPage.heading}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            {dictionary.tagsPage.description}
          </p>
        </div>

        {tags.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                className="glass-card group rounded-[1.5rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/55 focus-visible:-translate-y-1 focus-visible:border-primary/55 focus-visible:outline-none"
                href={getTagUrl(locale, tag.slug) as Route}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">
                      {dictionary.common.topic}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
                      {tag.label}
                    </h2>
                  </div>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-sm text-muted">
                    {tag.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <p className="text-sm font-medium tracking-[0.25em] text-muted uppercase">
              {dictionary.tagsPage.emptyLabel}
            </p>
            <h2 className="mt-4 text-2xl font-semibold">{dictionary.tagsPage.emptyTitle}</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              {dictionary.tagsPage.emptyDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
