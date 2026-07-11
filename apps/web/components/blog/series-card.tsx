import type { Route } from 'next';
import Image from 'next/image';

import { BaseLink } from '@/components/ui/links';
import { formatBlogDate } from '@/lib/blogs';
import { getSeriesPostCountLabel, type Dictionary, type Locale } from '@/lib/i18n';

import type { SeriesPreview } from './series-preview';
import { TagPill } from './tag-pill';

type SeriesCardProps = {
  series: SeriesPreview;
  locale: Locale;
  dictionary: Dictionary;
};

export function SeriesCard({ series, locale, dictionary }: SeriesCardProps) {
  return (
    <article className="glass-card group h-full overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:border-primary/55 focus-within:-translate-y-1 focus-within:border-primary/55">
      <BaseLink className="block focus-visible:outline-none" href={series.url as Route}>
        {series.coverImageUrl ? (
          <div className="relative aspect-[16/9] overflow-hidden border-b border-border/80">
            <Image
              alt={series.title}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 22rem, (min-width: 768px) 50vw, 100vw"
              src={series.coverImageUrl}
              unoptimized
            />
          </div>
        ) : (
          <div className="gradient-bg flex aspect-[16/9] items-end border-b border-border/80 p-6 text-white">
            <p className="max-w-72 text-sm font-semibold tracking-[0.18em] uppercase">
              {dictionary.seriesPage.heading}
            </p>
          </div>
        )}
      </BaseLink>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span>{formatBlogDate(series.publishedAt, locale)}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <TagPill tag={getSeriesPostCountLabel(dictionary, series.postCount)} />
        </div>

        <div className="space-y-3">
          <BaseLink className="block focus-visible:outline-none" href={series.url as Route}>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
              {series.title}
            </h2>
          </BaseLink>
          <p className="text-sm leading-7 text-muted">{series.description}</p>
        </div>
      </div>
    </article>
  );
}
