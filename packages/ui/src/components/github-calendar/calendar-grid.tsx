import { ContributionBlock } from './contribution-block';
import type { ContributionData } from './types';

type CalendarGridProps = {
  data: ContributionData;
  blockSize: number;
  blockGap: number;
  verticalLabel: boolean;
  horizontalLabel: boolean;
};

const visibleWeekdayLabels = new Map([
  [1, 'Mon'],
  [3, 'Wed'],
  [5, 'Fri'],
]);

function formatMonthLabel(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

function deriveMonthLabels(data: ContributionData) {
  if (data.monthLabels?.length) {
    return data.monthLabels;
  }

  const monthLabels: ContributionData['monthLabels'] = [];
  let previousMonth: string | null = null;

  data.weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays[0];

    if (!firstDay) {
      return;
    }

    const month = formatMonthLabel(firstDay.date);

    if (month !== previousMonth) {
      monthLabels?.push({ month, weekIndex });
      previousMonth = month;
    }
  });

  return monthLabels ?? [];
}

export function CalendarGrid({
  data,
  blockSize,
  blockGap,
  verticalLabel,
  horizontalLabel,
}: CalendarGridProps) {
  const monthLabels = deriveMonthLabels(data);
  const weekColumnWidth = blockSize + blockGap;

  return (
    <div className="min-w-max">
      {horizontalLabel ? (
        <div className="mb-3 flex items-end">
          {verticalLabel ? <div className="mr-3 w-8 shrink-0" aria-hidden="true" /> : null}
          <div
            className="relative h-4 text-[0.68rem] font-medium tracking-[0.16em] text-muted uppercase"
            style={{ width: data.weeks.length * weekColumnWidth }}
          >
            {monthLabels.map((label) => (
              <span
                key={`${label.month}-${label.weekIndex}`}
                className="absolute top-0"
                style={{ left: label.weekIndex * weekColumnWidth }}
              >
                {label.month}
              </span>
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
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <span key={dayIndex} className="flex items-center">
                {visibleWeekdayLabels.get(dayIndex) ?? ''}
              </span>
            ))}
          </div>
        ) : null}

        <div className="overflow-x-auto pb-1">
          <div
            className="flex"
            style={{
              columnGap: blockGap,
            }}
          >
            {data.weeks.map((week, weekIndex) => (
              <div
                key={`week-${weekIndex}`}
                className="flex flex-col"
                style={{
                  rowGap: blockGap,
                }}
              >
                {week.contributionDays.map((day) => (
                  <ContributionBlock key={day.date} day={day} size={blockSize} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
