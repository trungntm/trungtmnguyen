import type { Page } from '@/lib/pages';

type ActivitySectionProps = {
  activities?: Page['activities'] | undefined;
};

export function ActivitySection({ activities }: ActivitySectionProps) {
  if (!activities?.length) {
    return null;
  }

  return (
    <section className="glass-card rounded-[2rem] p-6 md:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
            Outside delivery
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">What I spend time on</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {activities.map((activity) => (
            <article
              key={activity.title}
              className="rounded-[1.5rem] border border-border/70 bg-surface/70 p-5"
            >
              <h3 className="text-lg font-semibold tracking-tight">{activity.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{activity.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
