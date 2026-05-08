import type { Metadata, Route } from 'next';
import Link from 'next/link';

import { BlogCard } from '@/components/blog/blog-card';
import { getAllTags, getPublishedBlogs } from '@/lib/blogs';
import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'All technical notes and articles.',
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/blog`,
    title: 'Blog',
    description: 'All technical notes and articles.',
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: 'Blog',
    description: 'All technical notes and articles.',
    images: [siteConfig.ogImage],
  },
};

export default function BlogPage() {
  const blogs = getPublishedBlogs();
  const tags = getAllTags();

  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-10">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Typed MDX posts for architecture, delivery, and engineering practice.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            Published articles are compiled from local MDX content with typed metadata, nested
            routes, and centralized draft handling ready for future preview support.
          </p>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  className="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium tracking-[0.18em] text-muted uppercase transition-colors hover:border-primary/35 hover:text-primary focus-visible:border-primary/35 focus-visible:text-primary focus-visible:outline-none"
                  href={`/tags/${tag.slug}` as Route}
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
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <p className="text-sm font-medium tracking-[0.25em] text-muted uppercase">
              No posts yet
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              The content pipeline is ready. The public article list is currently empty.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              Add an MDX file under <code className="gradient-text">apps/web/data/blogs</code> with
              valid frontmatter and it will appear here automatically unless marked as a draft.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
