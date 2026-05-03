import type { Page } from '@/lib/pages';

import { Chip } from './chip';

type SkillsSectionProps = {
  skills?: Page['skills'] | undefined;
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills?.length) {
    return null;
  }

  return (
    <section className="glass-card rounded-[2rem] p-6 md:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
            Capabilities
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Skills and technical scope</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {skills.map((group) => (
            <div
              key={group.title}
              className="rounded-[1.5rem] border border-border/70 bg-surface/70 p-5"
            >
              <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={`${group.title}-${item}`}>{item}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
