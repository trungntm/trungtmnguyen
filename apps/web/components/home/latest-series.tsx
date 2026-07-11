import { SeriesCard } from '@/components/blog/series-card';
import type { SeriesPreview } from '@/components/blog/series-preview';
import { BaseLink } from '@/components/ui/links';
import type { Dictionary, Locale } from '@/lib/i18n';

type LatestSeriesProps = {
  series: SeriesPreview[];
  locale: Locale;
  dictionary: Dictionary;
};

export function LatestSeries({ series, locale, dictionary }: LatestSeriesProps) {
  return (
    <section className="page-container px-4 md:px-6" aria-labelledby="latest-series-heading">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              {dictionary.home.latestSeriesEyebrow}
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              id="latest-series-heading"
            >
              {dictionary.home.latestSeriesTitle}
            </h2>
            <p className="text-base leading-8 text-muted sm:text-lg">
              {dictionary.home.latestSeriesDescription}
            </p>
          </div>
          <BaseLink
            className="text-sm font-semibold text-muted transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            href="/series"
          >
            {dictionary.seriesPage.viewAll}
          </BaseLink>
        </div>

        {series.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {series.map((entry) => (
              <SeriesCard key={entry.id} dictionary={dictionary} locale={locale} series={entry} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[2rem] p-8 sm:p-10">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
              {dictionary.home.latestSeriesEmptyLabel}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              {dictionary.home.latestSeriesEmptyTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              {dictionary.home.latestSeriesEmptyDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
