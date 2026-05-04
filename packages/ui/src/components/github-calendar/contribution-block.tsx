import type { ContributionDay } from './types';

type ContributionBlockProps = {
  day: ContributionDay;
  size: number;
};

function formatContributionLabel({ contributionCount, date }: ContributionDay) {
  const contributionText = contributionCount === 1 ? 'contribution' : 'contributions';

  return `${contributionCount} ${contributionText} on ${date}`;
}

export function ContributionBlock({ day, size }: ContributionBlockProps) {
  const label = formatContributionLabel(day);

  return (
    <div
      aria-label={label}
      className={[
        'cursor-pointer rounded-[0.35rem] border transition duration-200 ease-out hover:z-10 hover:scale-110 hover:border-cyan-400/60 hover:shadow-[0_10px_24px_-12px_rgba(34,211,238,0.45)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      ].join(' ')}
      role="img"
      style={{
        backgroundColor: day.color,
        borderColor: day.color,
        height: size,
        width: size,
      }}
      title={label}
    />
  );
}
