import type { Page } from '@/lib/pages';

type QuickFactsCardProps = {
  facts?: Page['quickFacts'] | undefined;
};

export function QuickFactsCard({ facts }: QuickFactsCardProps) {
  if (!facts?.length) {
    return null;
  }

  return (
    <section className="glass-card rounded-[2rem] p-6">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Quick facts</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Current focus</h2>
        </div>

        <dl className="space-y-4">
          {facts.map((fact) => (
            <div
              key={`${fact.label}-${fact.value}`}
              className="rounded-[1.5rem] border border-border/70 bg-surface/70 px-4 py-3"
            >
              <dt className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm font-medium text-foreground/90">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
