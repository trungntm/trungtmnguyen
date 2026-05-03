import type { Route } from 'next';
import Link from 'next/link';

import type { Blog } from '@/lib/blogs';
import { formatBlogDate } from '@/lib/blogs';

type LatestNotesProps = {
  blogs: Blog[];
};

export function LatestNotes({ blogs }: LatestNotesProps) {
  return (
    <section className="page-container px-4 md:px-6" aria-labelledby="latest-notes-heading">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              Latest notes
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              id="latest-notes-heading"
            >
              Latest notes
            </h2>
            <p className="text-base leading-8 text-muted sm:text-lg">
              Recent technical writing from real engineering decisions and production trade-offs.
            </p>
          </div>
          <Link
            className="text-sm font-semibold text-muted transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            href="/blog"
          >
            View all →
          </Link>
        </div>

        {blogs.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {blogs.map((blog) => {
              const primaryTag = blog.tags[0] ?? 'Note';

              return (
                <article key={blog.slug}>
                  <Link
                    className="glass-card group flex h-full flex-col rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/55 focus-visible:-translate-y-1 focus-visible:border-primary/55 focus-visible:outline-none"
                    href={blog.url as Route}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.22em] text-muted uppercase">
                          {primaryTag}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
                          {blog.title}
                        </h3>
                        <p className="text-sm leading-7 text-muted">{blog.description}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3 text-sm text-muted">
                      <span>{formatBlogDate(blog.publishedAt)}</span>
                      {blog.readingTime?.text ? (
                        <>
                          <span aria-hidden="true">•</span>
                          <span>{blog.readingTime.text}</span>
                        </>
                      ) : null}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-[2rem] p-8 sm:p-10">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              No published posts
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              The writing pipeline is ready. Public notes will appear here as they are published.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Draft entries remain excluded automatically. Add a published MDX post under
              `apps/web/data/blogs` and it will be picked up by Content Collections.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
