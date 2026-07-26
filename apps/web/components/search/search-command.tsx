'use client';

import { forwardRef, useEffect, useState, type CSSProperties } from 'react';

import type { Route } from 'next';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarSearch,
  useKBar,
  useMatches,
  VisualState,
} from 'kbar';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnalyticsEventNames, trackEvent } from '@trungtmnguyen/analytics';

import { useBlogSearch } from '@/components/search/use-blog-search';
import { formatBlogDate } from '@/lib/blogs';
import type { Dictionary, Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type PaletteActionItem = {
  id: string;
  name: string;
  subtitle?: string;
  perform?: () => void;
  url?: string;
  tags?: string[];
  publishedAt?: string;
  readingTime?: string;
  score?: number;
};

type NavigationActionItem = {
  id: string;
  name: string;
  subtitle?: string;
  command?: {
    perform: (action: NavigationActionItem) => void;
  };
};

type KBarRenderItem = string | PaletteActionItem | NavigationActionItem;

type SearchSectionItem = {
  type: 'section';
  id: string;
  label: string;
};

type SearchActionListItem = {
  type: 'action';
  item: PaletteActionItem | NavigationActionItem;
};

type MobileSearchListItem = SearchSectionItem | SearchActionListItem;

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
const DESKTOP_RESULTS_MAX_HEIGHT_FALLBACK = 520;
const MOBILE_RESULTS_MAX_HEIGHT_FALLBACK = 520;

type SearchViewportState = {
  isMobile: boolean;
  resultsMaxHeight: number;
};

const DEFAULT_VIEWPORT_STATE = {
  isMobile: false,
  resultsMaxHeight: DESKTOP_RESULTS_MAX_HEIGHT_FALLBACK,
} satisfies SearchViewportState;

function getViewportState(): SearchViewportState {
  if (typeof window === 'undefined') {
    return DEFAULT_VIEWPORT_STATE;
  }

  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
  const isMobile = mediaQuery.matches;
  const viewportHeight = window.innerHeight;
  const resultsMaxHeight = isMobile
    ? Math.min(viewportHeight * 0.6, MOBILE_RESULTS_MAX_HEIGHT_FALLBACK)
    : Math.min(viewportHeight * 0.55, DESKTOP_RESULTS_MAX_HEIGHT_FALLBACK);

  return {
    isMobile,
    resultsMaxHeight,
  };
}

function useSearchViewport() {
  const [viewport, setViewport] = useState<SearchViewportState>(DEFAULT_VIEWPORT_STATE);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateViewport = () => {
      setViewport(getViewportState());
    };

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    window.addEventListener('resize', updateViewport, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', updateViewport);
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  return viewport;
}

const SearchResultItem = forwardRef<
  HTMLDivElement,
  {
    active: boolean;
    item: PaletteActionItem | string | undefined;
    locale: Locale;
    resultBadgeLabel: string;
  }
>(function SearchResultItem({ active, item, locale, resultBadgeLabel }, ref) {
  if (!item) {
    return <div ref={ref} className="h-0" />;
  }

  if (typeof item === 'string') {
    return (
      <div
        ref={ref}
        className="px-4 py-2 text-[11px] font-semibold tracking-[0.24em] text-muted uppercase"
      >
        {item}
      </div>
    );
  }

  const tags = Array.isArray(item.tags) ? item.tags : [];
  const publishedAt =
    typeof item.publishedAt === 'string' && item.publishedAt.length > 0
      ? formatBlogDate(item.publishedAt, locale)
      : null;
  const readingTime =
    typeof item.readingTime === 'string' && item.readingTime.length > 0 ? item.readingTime : null;
  const isBlogResult = typeof item.url === 'string';

  return (
    <div
      ref={ref}
      className={cn(
        'mx-2 rounded-2xl border px-4 py-3 transition-colors',
        active
          ? 'border-primary/35 bg-primary/10 text-foreground'
          : 'border-transparent bg-transparent text-muted',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-foreground">{item.name}</div>
          {item.subtitle ? <div className="text-sm text-muted">{item.subtitle}</div> : null}
        </div>
        {item.score ? (
          <span className="shrink-0 rounded-full border border-border/70 bg-background/80 px-2 py-1 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
            {resultBadgeLabel}
          </span>
        ) : null}
      </div>

      {isBlogResult && (publishedAt || readingTime || tags.length > 0) ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          {publishedAt ? <span>{publishedAt}</span> : null}
          {readingTime ? <span>{readingTime}</span> : null}
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/70 bg-background/70 px-2 py-1 text-[11px]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
});

type SearchCommandProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SearchCommand({ locale, dictionary }: SearchCommandProps) {
  const { results: navigationResults } = useMatches();
  const { search, ready, error, latestBlogs } = useBlogSearch(locale);
  const router = useRouter();
  const { isMobile, resultsMaxHeight } = useSearchViewport();
  const { query, searchQuery, visualState, activeIndex } = useKBar(
    (state: { searchQuery: string; visualState: VisualState; activeIndex: number }) => ({
      activeIndex: state.activeIndex,
      visualState: state.visualState,
      searchQuery: state.searchQuery,
    }),
  );

  const trimmedQuery = searchQuery.trim();
  const blogResults = trimmedQuery ? search(trimmedQuery) : [];

  const visibleBlogs = trimmedQuery ? blogResults : latestBlogs;

  const blogResultActions: PaletteActionItem[] = visibleBlogs.map((result) => {
    const { id, ...document } = result;

    return {
      ...document,
      id: `blog-${id}`,
      name: result.title,
      subtitle: result.description,
      perform: () => {
        if (trimmedQuery) {
          trackEvent(AnalyticsEventNames.searchBlog, {
            locale,
            queryLength: trimmedQuery.length,
            resultCount: blogResults.length,
          });
        }

        router.push(result.url as Route);
      },
    };
  });

  const blogSectionTitle = trimmedQuery
    ? dictionary.search.postsSection
    : dictionary.search.latestPostsSection;
  const items: KBarRenderItem[] =
    blogResultActions.length > 0
      ? ([blogSectionTitle, ...blogResultActions, ...navigationResults] as KBarRenderItem[])
      : (navigationResults as KBarRenderItem[]);
  const resultItems: MobileSearchListItem[] = items.flatMap((item, index) => {
    if (typeof item === 'string') {
      return {
        type: 'section',
        id: `section-${index}-${item}`,
        label: item,
      };
    }

    return {
      type: 'action',
      item: item as PaletteActionItem | NavigationActionItem,
    };
  });
  const showLoading = trimmedQuery.length > 0 && !ready && !error;
  const showError = trimmedQuery.length > 0 && error !== null;
  const hasMatchResults = items.some((item) => typeof item !== 'string');
  const showEmpty = trimmedQuery.length > 0 && ready && !showError && !hasMatchResults;
  const positionerStyle: CSSProperties = isMobile
    ? {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        padding: '0px',
      }
    : {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '12vh 16px 16px',
      };
  const closedTransform = isMobile ? 'translateY(32px)' : 'translateY(-12px)';
  const openTransform = 'translateY(0)';
  const animatorStyle: CSSProperties = {
    maxWidth: isMobile ? undefined : '640px',
    maxHeight: isMobile ? '80dvh' : undefined,
    opacity: visualState === VisualState.showing ? 1 : 0,
    transform: visualState === VisualState.showing ? openTransform : closedTransform,
    transformOrigin: isMobile ? 'bottom center' : 'top center',
    transition:
      'transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)',
  };

  const actionIndexes = resultItems.flatMap((entry, index) =>
    entry.type === 'action' ? index : [],
  );

  useEffect(() => {
    if (actionIndexes.length === 0) {
      return;
    }

    const firstActionIndex = actionIndexes[0];

    if (firstActionIndex === undefined) {
      return;
    }

    if (activeIndex !== firstActionIndex && !actionIndexes.includes(activeIndex)) {
      query.setActiveIndex(firstActionIndex);
    }
  }, [actionIndexes, activeIndex, query]);

  useEffect(() => {
    if (visualState === VisualState.hidden) {
      return;
    }

    const executeActiveItem = () => {
      const activeItem = resultItems[activeIndex];

      if (!activeItem || activeItem.type !== 'action') {
        return;
      }

      const action = activeItem.item;

      if ('command' in action && action.command?.perform) {
        action.command.perform(action);
        query.toggle();
        return;
      }

      if ('perform' in action && typeof action.perform === 'function') {
        action.perform();
        query.toggle();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) {
        return;
      }

      if (event.key === 'ArrowDown' || (event.ctrlKey && event.key === 'n')) {
        event.preventDefault();
        event.stopPropagation();
        query.setActiveIndex((currentIndex) => {
          const currentActionPosition = actionIndexes.findIndex((index) => index === currentIndex);

          if (currentActionPosition === -1) {
            return actionIndexes[0] ?? currentIndex;
          }

          return (
            actionIndexes[Math.min(currentActionPosition + 1, actionIndexes.length - 1)] ??
            currentIndex
          );
        });
      } else if (event.key === 'ArrowUp' || (event.ctrlKey && event.key === 'p')) {
        event.preventDefault();
        event.stopPropagation();
        query.setActiveIndex((currentIndex) => {
          const currentActionPosition = actionIndexes.findIndex((index) => index === currentIndex);

          if (currentActionPosition === -1) {
            return actionIndexes[0] ?? currentIndex;
          }

          return actionIndexes[Math.max(currentActionPosition - 1, 0)] ?? currentIndex;
        });
      } else if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        executeActiveItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [activeIndex, actionIndexes, query, resultItems, visualState]);

  return (
    <KBarPortal>
      <KBarPositioner className="z-[90] bg-background/55 backdrop-blur-md" style={positionerStyle}>
        <KBarAnimator
          className={cn(
            'glass-card motion-reduce:transform-none motion-reduce:transition-none w-full overflow-hidden border border-border/70 bg-background/92',
            isMobile
              ? 'rounded-t-[1.75rem] border-b-0 pb-[env(safe-area-inset-bottom)] shadow-[0_-20px_60px_-28px_rgba(0,0,0,0.75)]'
              : 'rounded-[1.75rem] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.7)]',
          )}
          style={animatorStyle}
        >
          <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
            <Search className="size-4 text-muted" />
            <KBarSearch
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              defaultPlaceholder={dictionary.search.placeholder}
            />
          </div>

          {showLoading ? (
            <div className="border-b border-border/60 px-4 py-3 text-sm text-muted">
              {dictionary.search.loading}
            </div>
          ) : null}

          {showError ? (
            <div className="border-b border-border/60 px-4 py-3 text-sm text-muted">
              {dictionary.search.unavailable}
            </div>
          ) : null}

          {showEmpty ? (
            <div className="border-b border-border/60 px-4 py-3 text-sm text-muted">
              {dictionary.search.empty}
            </div>
          ) : null}

          <div className="py-2">
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: `${resultsMaxHeight}px`,
              }}
            >
              {resultItems.map((entry, index) => {
                if (entry.type === 'section') {
                  return (
                    <div
                      key={entry.id}
                      className="px-4 py-2 text-[11px] font-semibold tracking-[0.24em] text-muted uppercase"
                    >
                      {entry.label}
                    </div>
                  );
                }

                const action = entry.item;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={action.id}
                    className="block w-full text-left"
                    type="button"
                    onClick={() => {
                      if ('command' in action && action.command?.perform) {
                        action.command.perform(action);
                        query.toggle();
                        return;
                      }

                      if ('perform' in action && typeof action.perform === 'function') {
                        action.perform();
                        query.toggle();
                      }
                    }}
                    onMouseMove={() => {
                      if (activeIndex !== index) {
                        query.setActiveIndex(index);
                      }
                    }}
                  >
                    <SearchResultItem
                      active={isActive}
                      item={action as PaletteActionItem | string | undefined}
                      locale={locale}
                      resultBadgeLabel={dictionary.common.blog}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}
