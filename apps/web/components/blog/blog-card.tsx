import type { Route } from 'next';
import Image from 'next/image';

import { BaseLink } from '@/components/ui/links';
import type { Blog } from '@/lib/blogs';
import { formatBlogDate } from '@/lib/blogs';
import type { Dictionary, Locale } from '@/lib/i18n';
import { resolvePublicAsset } from '@/lib/public-assets';

import { TagLink } from './tag-link';

type BlogCardProps = {
  blog: Blog;
  locale: Locale;
  dictionary: Dictionary;
};

export function BlogCard({ blog, locale, dictionary }: BlogCardProps) {
  const thumbnail = resolvePublicAsset(blog.thumbnail);

  return (
    <article className="glass-card group h-full overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:border-primary/55 focus-within:-translate-y-1 focus-within:border-primary/55">
      <BaseLink className="block focus-visible:outline-none" href={blog.url as Route}>
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
      </BaseLink>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span>{formatBlogDate(blog.publishedAt, locale)}</span>
          <span>{blog.author}</span>
          <span>{blog.readingTime.text}</span>
        </div>

        <div className="space-y-3">
          <BaseLink className="block focus-visible:outline-none" href={blog.url as Route}>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
              {blog.title}
            </h2>
          </BaseLink>
          <p className="text-sm leading-7 text-muted">{blog.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag: string) => (
            <TagLink
              key={tag}
              ariaLabel={`${dictionary.tagsPage.heading} ${tag}`}
              locale={locale}
              tag={tag}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
