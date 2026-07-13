const ALLOWED_SEARCH_PARAMETERS = new Set(['page', 'ref', 'tag']);

type SearchParamsLike = {
  entries(): IterableIterator<[string, string]>;
};

export function buildAnalyticsPath(
  pathname: string,
  searchParams: SearchParamsLike,
) {
  const filteredSearchParams = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    if (!ALLOWED_SEARCH_PARAMETERS.has(key)) {
      continue;
    }

    filteredSearchParams.append(key, value);
  }

  const serializedSearch = filteredSearchParams.toString();
  return serializedSearch ? `${pathname}?${serializedSearch}` : pathname;
}

export function shouldTrackPageView(previousPath: string | null, nextPath: string) {
  return previousPath !== nextPath;
}
