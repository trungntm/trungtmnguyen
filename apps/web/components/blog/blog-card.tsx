import type { Route } from 'next';
import Image from 'next/image';

import { BaseLink } from '@/components/ui/links';
import { formatBlogDate } from '@/lib/blogs';
import type { Dictionary, Locale } from '@/lib/i18n';
import { resolvePublicAsset } from '@/lib/public-assets';

import type { BlogPreview } from './blog-preview';
import { TagPill } from './tag-pill';
import { TagLink } from './tag-link';

type BlogCardProps = {
  blog: BlogPreview;
  locale: Locale;
  dictionary: Dictionary;
  disableTagLinks?: boolean;
};

export function BlogCard({ blog, locale, dictionary, disableTagLinks = false }: BlogCardProps) {
  const thumbnail = resolvePublicAsset(blog.thumbnail) ?? blog.coverImageUrl ?? null;

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
              unoptimized={!thumbnail.startsWith('/')}
            />
          </div>
        ) : null}
      </BaseLink>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span>{formatBlogDate(blog.publishedAt, locale)}</span>
          {blog.author ? <span>{blog.author}</span> : null}
          {blog.readingTime?.text ? <span>{blog.readingTime.text}</span> : null}
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
          {blog.tags.map((tag: string) =>
            disableTagLinks ? (
              <TagPill key={tag} tag={tag} />
            ) : (
              <TagLink
                key={tag}
                ariaLabel={`${dictionary.tagsPage.heading} ${tag}`}
                locale={locale}
                tag={tag}
              />
            ),
          )}
        </div>
      </div>
    </article>
  );
}
