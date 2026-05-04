import { CalendarGrid } from './calendar-grid';
import { CalendarLegend } from './calendar-legend';
import { GithubCalendarSkeleton } from './github-calendar-skeleton';
import { getContributionLevel } from './themes';
import type { GithubCalendarProps } from './types';

function deriveLegendColors(data: NonNullable<GithubCalendarProps['data']>) {
  const sampleColors = new Map<0 | 1 | 2 | 3 | 4, string>();

  for (const week of data.weeks) {
    for (const day of week.contributionDays) {
      if (!day.color) {
        continue;
      }

      const level = getContributionLevel(day.contributionCount);

      if (sampleColors.has(level)) {
        continue;
      }

      sampleColors.set(level, day.color);
    }
  }

  return [0, 1, 2, 3, 4]
    .map((level) => sampleColors.get(level as 0 | 1 | 2 | 3 | 4))
    .filter((color): color is string => Boolean(color));
}

export function GithubCalendar({
  user,
  data,
  isLoading = false,
  error,
  legend = true,
  verticalLabel = true,
  horizontalLabel = true,
  blockSize = 12,
  blockGap = 4,
  className,
}: GithubCalendarProps) {
  if (isLoading || error || !data) {
    return (
      <GithubCalendarSkeleton
        blockGap={blockGap}
        blockSize={blockSize}
        horizontalLabel={horizontalLabel}
        legend={legend}
        verticalLabel={verticalLabel}
        {...(className ? { className } : {})}
      />
    );
  }

  const legendColors = deriveLegendColors(data);

  return (
    <div
      className={[
        'overflow-hidden rounded-[1.5rem] border border-border bg-surface/65 p-5 md:p-6',
        className ?? '',
      ].join(' ')}
    >
      <div className="space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-muted uppercase">
              GitHub
            </p>
            <p className="text-sm text-foreground/85">
              <span className="font-medium text-foreground">{data.totalContributions}</span>{' '}
              contributions from <span className="font-medium text-foreground">@{user}</span>
            </p>
          </div>
        </header>

        <div className="overflow-x-auto">
          <CalendarGrid
            blockGap={blockGap}
            blockSize={blockSize}
            data={data}
            horizontalLabel={horizontalLabel}
            verticalLabel={verticalLabel}
          />
        </div>

        {legend && legendColors.length ? (
          <CalendarLegend blockSize={blockSize} colors={legendColors} />
        ) : null}
      </div>
    </div>
  );
}
