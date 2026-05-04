import MiniSearch from 'minisearch';

import { miniSearchConfig, type SearchIndexDocument } from './minisearch-config';

export function loadSearchIndex(indexJson: string | Record<string, unknown>) {
  const serializedIndex = typeof indexJson === 'string' ? indexJson : JSON.stringify(indexJson);

  return MiniSearch.loadJSON<SearchIndexDocument>(serializedIndex, miniSearchConfig);
}
