'use client';

import type { SearchRenderDocument } from '@repo/search';

export const SEARCH_INDEX_URL = '/search-index.json';
export const SEARCH_DOCS_URL = '/search-docs.json';
export const SEARCH_FETCH_OPTIONS = {
  cache: 'force-cache',
} as const;

type SearchDocsMap = Record<string, SearchRenderDocument>;

type RequestIdleCallbackHandle = number;

type RequestIdleCallbackOptions = {
  timeout?: number;
};

type RequestIdleCallbackFn = (
  callback: IdleRequestCallback,
  options?: RequestIdleCallbackOptions,
) => RequestIdleCallbackHandle;

let preloadStarted = false;

export function fetchSearchIndexJson() {
  return fetch(SEARCH_INDEX_URL, SEARCH_FETCH_OPTIONS).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Search index request failed with ${response.status}`);
    }

    return response.json();
  });
}

export function fetchSearchDocsJson() {
  return fetch(SEARCH_DOCS_URL, SEARCH_FETCH_OPTIONS).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Search docs request failed with ${response.status}`);
    }

    return response.json() as Promise<SearchDocsMap>;
  });
}

export function preloadSearchAssets() {
  if (preloadStarted || typeof window === 'undefined') {
    return;
  }

  preloadStarted = true;

  const run = () => {
    void Promise.allSettled([
      fetch(SEARCH_INDEX_URL, SEARCH_FETCH_OPTIONS),
      fetch(SEARCH_DOCS_URL, SEARCH_FETCH_OPTIONS),
    ]);
  };

  if ('requestIdleCallback' in window) {
    (window.requestIdleCallback as RequestIdleCallbackFn)(run, { timeout: 3000 });
    return;
  }

  setTimeout(run, 1500);
}
