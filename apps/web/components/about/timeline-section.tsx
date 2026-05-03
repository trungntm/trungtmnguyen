type TimelineEntry = {
  label: string;
  title: string;
  description: string;
};

type TimelineSectionProps = {
  eyebrow: string;
  title: string;
  items?: TimelineEntry[];
};

export function TimelineSection({ eyebrow, title, items }: TimelineSectionProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="glass-card rounded-[2rem] p-6 md:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">{eyebrow}</p>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={`${item.label}-${item.title}`}
              className="relative rounded-[1.5rem] border border-border/70 bg-surface/70 p-5 pl-7"
            >
              <div className="absolute left-4 top-6 h-[calc(100%-3rem)] w-px bg-border/80" />
              <div className="absolute left-[0.82rem] top-5 size-2.5 rounded-full bg-primary" />
              <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                {item.label}
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
