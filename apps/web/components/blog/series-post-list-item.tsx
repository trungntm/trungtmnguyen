import type { Route } from 'next';

import { OptimizedImage } from '@/components/ui/optimized-image';

import { TrackedLink } from '@/components/analytics/tracked-link';
import { TagPill } from '@/components/blog/tag-pill';
import { formatBlogDate } from '@/lib/blogs';
import { formatMessage, type Dictionary, type Locale } from '@/lib/i18n';
import type { SeriesPost } from '@/features/cms-blog/types';
import { AnalyticsEventNames } from '@trungtmnguyen/analytics';

type SeriesPostListItemProps = {
  post: SeriesPost;
  seriesId: string;
  locale: Locale;
  dictionary: Dictionary;
  index: number;
};

function getPartLabel(dictionary: Dictionary, post: SeriesPost, index: number) {
  return formatMessage(dictionary.seriesPage.partLabel, {
    order: post.seriesOrder ?? index + 1,
  });
}

export function SeriesPostListItem({ post, seriesId, locale, dictionary, index }: SeriesPostListItemProps) {
  const eventParameters = {
    locale,
    postId: post.id,
    position: post.seriesOrder ?? index + 1,
    seriesId,
    slug: post.slug,
  } as const;

  return (
    <article className="glass-card group h-full overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:border-primary/55 focus-within:-translate-y-1 focus-within:border-primary/55">
      <TrackedLink
        className="block focus-visible:outline-none"
        eventName={AnalyticsEventNames.selectSeriesPost}
        eventParameters={eventParameters}
        href={post.url as Route}
      >
        {post.coverImageUrl ? (
          <div className="relative aspect-[16/9] overflow-hidden border-b border-border/80">
            <OptimizedImage
              alt={post.title}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 22rem, (min-width: 768px) 50vw, 100vw"
              src={post.coverImageUrl}
            />
          </div>
        ) : (
          <div className="gradient-bg flex aspect-[16/9] items-end border-b border-border/80 p-6 text-white">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase">
              {getPartLabel(dictionary, post, index)}
            </span>
          </div>
        )}
      </TrackedLink>

      <div className="space-y-5 p-6">
        <div className="space-y-2 text-sm text-muted">
          <div>
            <span className="font-semibold text-primary">{getPartLabel(dictionary, post, index)}</span>
          </div>
          <div>
            <span>{formatBlogDate(post.publishedAt, locale)}</span>
          </div>
        </div>

        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagPill key={tag.id} tag={tag.name} />
            ))}
          </div>
        ) : null}

        <div className="space-y-3">
          <TrackedLink
            className="block focus-visible:outline-none"
            eventName={AnalyticsEventNames.selectSeriesPost}
            eventParameters={eventParameters}
            href={post.url as Route}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
              {post.title}
            </h2>
          </TrackedLink>
          {post.description ? (
            <p className="text-sm leading-7 text-muted">{post.description}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
