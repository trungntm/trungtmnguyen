const focusAreas = [
  'Monorepo + Turborepo',
  'SEO and metadata baseline',
  'Theme-aware design system',
];

export function FocusPanel() {
  return (
    <aside className="glass-card relative overflow-hidden rounded-[2rem] p-8 md:p-10">
      <div className="gradient-bg absolute inset-x-0 top-0 h-1" />
      <div className="space-y-8">
        <div>
          <p className="text-xs font-medium tracking-[0.25em] text-muted uppercase">
            Current focus
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Platform and writing infrastructure</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {focusAreas.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Ready for next phases</span>
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_20px_var(--color-accent)]" />
          </div>
          <p className="mt-3 text-sm leading-7 text-muted">
            Content modeling, MDX rendering, search, RSS, and publishing workflows can layer on top
            of this baseline without reshaping the app shell.
          </p>
        </div>
      </div>
    </aside>
  );
}
