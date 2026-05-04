export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export function getContributionLevel(contributionCount: number): ContributionLevel {
  if (contributionCount <= 0) {
    return 0;
  }

  if (contributionCount <= 3) {
    return 1;
  }

  if (contributionCount <= 6) {
    return 2;
  }

  if (contributionCount <= 9) {
    return 3;
  }

  return 4;
}
