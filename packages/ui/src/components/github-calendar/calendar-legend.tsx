type CalendarLegendProps = {
  blockSize: number;
  colors: string[];
};

export function CalendarLegend({ blockSize, colors }: CalendarLegendProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-muted">
      <span>Less</span>
      <div className="flex items-center gap-1.5">
        {colors.map((color, index) => (
          <span
            key={`${color}-${index}`}
            aria-hidden="true"
            className="inline-flex rounded-[0.35rem] border"
            style={{
              backgroundColor: color,
              borderColor: color,
              height: blockSize,
              width: blockSize,
            }}
          />
        ))}
      </div>
      <span>More</span>
    </div>
  );
}
