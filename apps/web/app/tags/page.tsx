import type { Metadata, Route } from 'next';
import Link from 'next/link';

import { getAllTags, getTagUrl } from '@/lib/blogs';
import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse technical notes by topic.',
  alternates: {
    canonical: `${siteConfig.url}/tags`,
  },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/tags`,
    title: 'Tags',
    description: 'Browse technical notes by topic.',
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: 'Tags',
    description: 'Browse technical notes by topic.',
    images: [siteConfig.ogImage],
  },
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-10">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Browse technical notes by topic.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            Tags are generated from published blog frontmatter and grouped into stable public URLs.
          </p>
        </div>

        {tags.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                className="glass-card group rounded-[1.5rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/55 focus-visible:-translate-y-1 focus-visible:border-primary/55 focus-visible:outline-none"
                href={getTagUrl(tag.slug) as Route}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">
                      Topic
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
              No tags yet
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              Published posts will generate public tag pages automatically.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              Draft entries stay excluded, so only published frontmatter affects the tag index.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
