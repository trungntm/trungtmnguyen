import MiniSearch from 'minisearch';

import type { SearchDocument } from './types';

type SearchIndexDocument = SearchDocument & {
  tagsText: string;
};

export type { SearchIndexDocument };

export const miniSearchConfig = {
  fields: ['title', 'description', 'tagsText', 'content'],
  storeFields: ['id'],
  searchOptions: {
    boost: {
      title: 4,
      tagsText: 3,
      description: 2,
      content: 1,
    },
    prefix: true,
    fuzzy: 0.2,
  },
} satisfies ConstructorParameters<typeof MiniSearch<SearchIndexDocument>>[0];

export function createMiniSearch() {
  return new MiniSearch<SearchIndexDocument>(miniSearchConfig);
}
