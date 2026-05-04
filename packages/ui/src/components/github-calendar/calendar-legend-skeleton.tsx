type CalendarLegendSkeletonProps = {
  blockSize: number;
};

export function CalendarLegendSkeleton({ blockSize }: CalendarLegendSkeletonProps) {
  return (
    <div className="flex items-center justify-end gap-2 text-xs text-muted">
      <span>Less</span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="inline-flex animate-pulse rounded-[0.35rem] border border-border/70 bg-surface/70"
            style={{ height: blockSize, width: blockSize }}
          />
        ))}
      </div>
      <span>More</span>
    </div>
  );
}
