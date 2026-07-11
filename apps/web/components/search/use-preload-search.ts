'use client';

import type { SearchRenderDocument } from '@trungtmnguyen/search';

export const SEARCH_INDEX_URL = '/api/search/index';
export const SEARCH_DOCS_URL = '/api/search/docs';
export const SEARCH_FETCH_OPTIONS = {
  cache: 'force-cache',
} as const;
export const SEARCH_REFRESH_FETCH_OPTIONS = {
  cache: 'no-store',
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

type SearchFetchMode = 'cache' | 'refresh';

const searchIndexRequests = new Map<SearchFetchMode, Promise<unknown>>();
const searchDocsRequests = new Map<SearchFetchMode, Promise<SearchDocsMap>>();

function getFetchOptions(mode: SearchFetchMode) {
  return mode === 'refresh' ? SEARCH_REFRESH_FETCH_OPTIONS : SEARCH_FETCH_OPTIONS;
}

export function fetchSearchIndexJson(mode: SearchFetchMode = 'cache') {
  const existingRequest = searchIndexRequests.get(mode);

  if (existingRequest) {
    return existingRequest;
  }

  const request = fetch(SEARCH_INDEX_URL, getFetchOptions(mode))
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Search index request failed with ${response.status}`);
      }

      return response.json();
    })
    .catch((error: unknown) => {
      searchIndexRequests.delete(mode);
      throw error;
    });

  searchIndexRequests.set(mode, request);
  return request;
}

export function fetchSearchDocsJson(mode: SearchFetchMode = 'cache') {
  const existingRequest = searchDocsRequests.get(mode);

  if (existingRequest) {
    return existingRequest;
  }

  const request = fetch(SEARCH_DOCS_URL, getFetchOptions(mode))
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Search docs request failed with ${response.status}`);
      }

      return response.json() as Promise<SearchDocsMap>;
    })
    .catch((error: unknown) => {
      searchDocsRequests.delete(mode);
      throw error;
    });

  searchDocsRequests.set(mode, request);
  return request;
}

export function preloadSearchAssets() {
  if (preloadStarted || typeof window === 'undefined') {
    return;
  }

  preloadStarted = true;

  const run = () => {
    void Promise.allSettled([
      fetchSearchIndexJson(),
      fetchSearchDocsJson(),
    ]);
  };

  if ('requestIdleCallback' in window) {
    (window.requestIdleCallback as RequestIdleCallbackFn)(run, { timeout: 3000 });
    return;
  }

  setTimeout(run, 1500);
}
