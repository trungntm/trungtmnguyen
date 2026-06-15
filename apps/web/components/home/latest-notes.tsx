import type { Route } from 'next';

import type { Blog } from '@/lib/blogs';
import { formatBlogDate } from '@/lib/blogs';
import type { Dictionary, Locale } from '@/lib/i18n';

import { TagLink } from '@/components/blog/tag-link';
import { BaseLink } from '@/components/ui/links';

type LatestNotesProps = {
  blogs: Blog[];
  locale: Locale;
  dictionary: Dictionary;
};

export function LatestNotes({ blogs, locale, dictionary }: LatestNotesProps) {
  return (
    <section className="page-container px-4 md:px-6" aria-labelledby="latest-notes-heading">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              {dictionary.home.latestEyebrow}
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              id="latest-notes-heading"
            >
              {dictionary.home.latestTitle}
            </h2>
            <p className="text-base leading-8 text-muted sm:text-lg">
              {dictionary.home.latestDescription}
            </p>
          </div>
          <BaseLink
            className="text-sm font-semibold text-muted transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            href="/blog"
          >
            {dictionary.home.viewAll}
          </BaseLink>
        </div>

        {blogs.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {blogs.map((blog) => {
              const primaryTag = blog.tags[0];

              return (
                <article
                  key={blog.slug}
                  className="glass-card group flex h-full flex-col rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/55 focus-within:-translate-y-1 focus-within:border-primary/55"
                >
                  {primaryTag ? (
                    <div className="mb-4 flex items-center gap-3">
                      <TagLink
                        className="bg-background/60"
                        locale={locale}
                        size="sm"
                        tag={primaryTag}
                      />
                    </div>
                  ) : null}

                  <BaseLink className="block focus-visible:outline-none" href={blog.url as Route}>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
                          {blog.title}
                        </h3>
                        <p className="text-sm leading-7 text-muted">{blog.description}</p>
                      </div>
                    </div>
                  </BaseLink>

                  <div className="mt-6 flex items-center gap-3 text-sm text-muted">
                    <span>{formatBlogDate(blog.publishedAt, locale)}</span>
                    {blog.readingTime?.text ? (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{blog.readingTime.text}</span>
                      </>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-[2rem] p-8 sm:p-10">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              {dictionary.home.latestEmptyLabel}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              {dictionary.home.latestEmptyTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              {dictionary.home.latestEmptyDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
