import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import type { Blog } from '@/lib/blogs';
import { formatBlogDate } from '@/lib/blogs';
import { resolvePublicAsset } from '@/lib/public-assets';

import { TagPill } from './tag-pill';

type BlogCardProps = {
  blog: Blog;
};

export function BlogCard({ blog }: BlogCardProps) {
  const thumbnail = resolvePublicAsset(blog.thumbnail);

  return (
    <article>
      <Link
        className="glass-card group block h-full overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:border-primary/55 focus-visible:-translate-y-1 focus-visible:border-primary/55 focus-visible:outline-none"
        href={blog.url as Route}
      >
        {thumbnail ? (
          <div className="relative aspect-[16/9] overflow-hidden border-b border-border/80">
            <Image
              alt={blog.title}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 22rem, (min-width: 768px) 50vw, 100vw"
              src={thumbnail}
            />
          </div>
        ) : null}

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span>{formatBlogDate(blog.publishedAt)}</span>
            <span>{blog.author}</span>
            <span>{blog.readingTime.text}</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
              {blog.title}
            </h2>
            <p className="text-sm leading-7 text-muted">{blog.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
