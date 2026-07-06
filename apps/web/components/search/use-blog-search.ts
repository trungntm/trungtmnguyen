'use client';

import { useEffect, useRef, useState } from 'react';

import { loadSearchIndex, type SearchRenderDocument } from '@repo/search';

import { fetchSearchDocsJson, fetchSearchIndexJson } from '@/components/search/use-preload-search';
import type { Locale } from '@/lib/i18n';

type SearchIndexInstance = ReturnType<typeof loadSearchIndex>;

export type BlogSearchResult = SearchRenderDocument & {
  score: number;
};

type BlogSearchState = {
  ready: boolean;
  error: Error | null;
  latestBlogs: SearchRenderDocument[];
  search: (query: string) => BlogSearchResult[];
};

let cachedIndex: SearchIndexInstance | null = null;
let cachedDocsById: Record<string, SearchRenderDocument> | null = null;
let cachedError: Error | null = null;
let loadPromise: Promise<void> | null = null;

// Keep the loaded index in module scope so palette mounts stay hydration-safe and cheap.
async function loadSearchAssets(forceRefresh = false) {
  if (!forceRefresh && cachedIndex && cachedDocsById) {
    return;
  }

  if (!forceRefresh && cachedError) {
    throw cachedError;
  }

  if (forceRefresh) {
    cachedError = null;
    loadPromise = null;
  }

  if (!loadPromise) {
    loadPromise = Promise.all([
      fetchSearchIndexJson(forceRefresh ? 'refresh' : 'cache'),
      fetchSearchDocsJson(forceRefresh ? 'refresh' : 'cache'),
    ])
      .then(([serializedIndex, docsById]) => {
        cachedIndex = loadSearchIndex(serializedIndex);
        cachedDocsById = docsById;
      })
      .catch((error: unknown) => {
        cachedError = error instanceof Error ? error : new Error('Search unavailable');
        throw cachedError;
      });
  }

  return loadPromise;
}

function getLatestBlogs(locale: Locale) {
  if (!cachedDocsById) {
    return [];
  }

  return Object.values(cachedDocsById)
    .filter((document) => document.locale === locale)
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
    .slice(0, 3);
}

function hasLocaleDocuments(locale: Locale) {
  if (!cachedDocsById) {
    return false;
  }

  return Object.values(cachedDocsById).some((document) => document.locale === locale);
}

export function useBlogSearch(locale: Locale): BlogSearchState {
  const [ready, setReady] = useState(() => cachedIndex !== null && cachedDocsById !== null);
  const [error, setError] = useState<Error | null>(cachedError);
  const refreshAttemptedLocalesRef = useRef<Set<Locale>>(new Set());

  useEffect(() => {
    if (ready || error) {
      return;
    }

    let isSubscribed = true;

    void loadSearchAssets()
      .then(() => {
        if (isSubscribed) {
          setReady(true);
        }
      })
      .catch((loadError: unknown) => {
        if (isSubscribed) {
          setError(loadError instanceof Error ? loadError : new Error('Search unavailable'));
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [error, ready]);

  useEffect(() => {
    if (!ready || error || hasLocaleDocuments(locale)) {
      return;
    }

    if (refreshAttemptedLocalesRef.current.has(locale)) {
      return;
    }

    refreshAttemptedLocalesRef.current.add(locale);

    let isSubscribed = true;

    void loadSearchAssets(true)
      .then(() => {
        if (isSubscribed) {
          setReady(true);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (isSubscribed) {
          setError(loadError instanceof Error ? loadError : new Error('Search unavailable'));
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [error, locale, ready]);

  return {
    ready,
    error,
    latestBlogs: getLatestBlogs(locale),
    search(query) {
      const normalizedQuery = query.trim();

      if (!normalizedQuery || !cachedIndex || !cachedDocsById) {
        return [];
      }

      return cachedIndex
        .search(normalizedQuery)
        .slice(0, 10)
        .flatMap((result: { id: string; score: number }) => {
          const document = cachedDocsById?.[result.id];

          if (!document) {
            return [];
          }

          if (document.locale !== locale) {
            return [];
          }

          return {
            ...document,
            score: result.score,
          };
        });
    },
  };
}
