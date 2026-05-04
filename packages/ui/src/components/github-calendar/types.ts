export type ContributionDay = {
  date: string;
  contributionCount: number;
  color?: string;
};

export type Week = {
  contributionDays: ContributionDay[];
};

export type ContributionData = {
  totalContributions: number;
  weeks: Week[];
  monthLabels?: {
    month: string;
    weekIndex: number;
  }[];
};

export type GithubCalendarProps = {
  user: string;
  data?: ContributionData;
  isLoading?: boolean;
  error?: unknown;
  legend?: boolean;
  verticalLabel?: boolean;
  horizontalLabel?: boolean;
  blockSize?: number;
  blockGap?: number;
  className?: string;
};
