import { GithubCalendar } from '@trungtmnguyen/ui';

import { getGithubContributionData } from '@/lib/github';

type GithubCalendarSectionProps = {
  user: string;
};

export async function GithubCalendarSection({ user }: GithubCalendarSectionProps) {
  let data: Awaited<ReturnType<typeof getGithubContributionData>> | undefined;
  let error: unknown;

  try {
    data = await getGithubContributionData(user);
  } catch (fetchError) {
    error = fetchError;
  }

  return (
    <section className="glass-card rounded-4xl p-6 md:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
            Open source
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">GitHub Activity</h2>
          <p className="max-w-2xl text-sm leading-7 text-muted md:text-base">
            A quick view of my recent coding activity and open-source contribution rhythm.
          </p>
        </div>

        <GithubCalendar
          className="rounded-[1.5rem] border-border/70 bg-surface/70 shadow-none"
          horizontalLabel
          legend
          user={user}
          verticalLabel
          {...(data ? { data } : {})}
          {...(error ? { error } : {})}
        />
      </div>
    </section>
  );
}
