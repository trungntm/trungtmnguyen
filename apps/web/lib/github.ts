import type { ContributionData } from '@trungtmnguyen/ui';

type GithubCalendarResponse = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            date: string;
            contributionCount: number;
            color?: string;
          }>;
        }>;
      };
    };
  } | null;
};

type GithubContributionCalendar =
  NonNullable<GithubCalendarResponse['user']>['contributionsCollection']['contributionCalendar'];

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const GITHUB_CONTRIBUTIONS_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

export const GITHUB_CONTRIBUTIONS_REVALIDATE_SECONDS = 60 * 60 * 6;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export class GithubContributionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GithubContributionsError';
  }
}

export function createEmptyContributionData(): ContributionData {
  return {
    totalContributions: 0,
    weeks: [],
    monthLabels: [],
  };
}

function getContributionRange() {
  const today = new Date();
  const fromDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  return {
    from: fromDate.toISOString(),
    to: today.toISOString(),
    today,
  };
}

function transformContributionData(calendar: GithubContributionCalendar): ContributionData {
  const monthLabels: NonNullable<ContributionData['monthLabels']> = [];
  const { today } = getContributionRange();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  let lastMonth = -1;

  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks.map((week: GithubContributionCalendar['weeks'][number], weekIndex) => {
      const firstDay = week.contributionDays[0];

      if (firstDay) {
        const day = new Date(firstDay.date);
        const month = day.getMonth();
        const year = day.getFullYear();
        const monthName = MONTHS[month] ?? '';
        const monthLabel = month === currentMonth && year === currentYear - 1 ? '' : monthName;

        if (month !== lastMonth) {
          monthLabels.push({
            month: monthLabel,
            weekIndex,
          });
          lastMonth = month;
        }
      }

      return {
        contributionDays: week.contributionDays.map((day) => ({
          contributionCount: day.contributionCount,
          date: day.date,
          ...(day.color ? { color: day.color } : {}),
        })),
      };
    }),
    monthLabels,
  };
}

export async function getGithubContributionData(user: string): Promise<ContributionData> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new GithubContributionsError('Missing GITHUB_TOKEN environment variable.');
  }

  const { from, to } = getContributionRange();

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    signal: AbortSignal.timeout(5000),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GITHUB_CONTRIBUTIONS_QUERY,
      variables: {
        from,
        login: user,
        to,
      },
    }),
    next: {
      revalidate: GITHUB_CONTRIBUTIONS_REVALIDATE_SECONDS,
      tags: [`github-contributions-${user}`],
    },
  });

  if (!response.ok) {
    throw new GithubContributionsError(
      `GitHub API request failed with status ${response.status}.`,
    );
  }

  const payload = (await response.json()) as {
    data?: GithubCalendarResponse;
    errors?: Array<{ message?: string }>;
  };

  if (payload.errors?.length) {
    throw new GithubContributionsError(
      payload.errors[0]?.message ?? 'GitHub GraphQL query failed.',
    );
  }

  const calendar = payload.data?.user?.contributionsCollection.contributionCalendar;

  if (!calendar) {
    throw new GithubContributionsError(`GitHub user "${user}" was not found.`);
  }

  return transformContributionData(calendar);
}
