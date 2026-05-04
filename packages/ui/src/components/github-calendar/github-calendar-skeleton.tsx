import { CalendarLegendSkeleton } from './calendar-legend-skeleton';

type GithubCalendarSkeletonProps = {
  legend?: boolean;
  verticalLabel?: boolean;
  horizontalLabel?: boolean;
  blockSize: number;
  blockGap: number;
  className?: string;
};

export function GithubCalendarSkeleton({
  legend = true,
  verticalLabel = true,
  horizontalLabel = true,
  blockSize,
  blockGap,
  className,
}: GithubCalendarSkeletonProps) {
  return (
    <div
      className={[
        'overflow-hidden rounded-[1.5rem] border border-border bg-surface/65 p-5 md:p-6',
        className ?? '',
      ].join(' ')}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded-full bg-surface/80" />
          <div className="h-6 w-56 animate-pulse rounded-full bg-surface/80" />
        </div>

        <div className="overflow-x-auto">
          {horizontalLabel ? (
            <div className="mb-3 flex items-end">
              {verticalLabel ? <div className="mr-3 w-8 shrink-0" aria-hidden="true" /> : null}
              <div className="flex gap-10">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-3 w-8 animate-pulse rounded-full bg-surface/80"
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-start">
            {verticalLabel ? (
              <div
                aria-hidden="true"
                className="mr-3 grid shrink-0 text-[0.68rem] font-medium tracking-[0.14em] text-muted uppercase"
                style={{
                  gridTemplateRows: `repeat(7, ${blockSize}px)`,
                  rowGap: blockGap,
                  width: 32,
                }}
              >
                {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, index) => (
                  <span key={index} className="flex items-center">
                    {label}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex" style={{ columnGap: blockGap }}>
              {Array.from({ length: 18 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col" style={{ rowGap: blockGap }}>
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className="animate-pulse rounded-[0.35rem] border border-border/70 bg-surface/80"
                      style={{ height: blockSize, width: blockSize }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {legend ? <CalendarLegendSkeleton blockSize={blockSize} /> : null}
      </div>
    </div>
  );
}
