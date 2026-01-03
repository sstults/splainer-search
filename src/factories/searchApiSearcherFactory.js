/**
 * Factory for creating SearchAPI searchers
 */
import { SearchApiAdapter } from '../adapters/searchApi/SearchApiAdapter.js';
import { Searcher } from '../core/Searcher.js';

/**
 * Create a searchapi searcher
 * @param {Object} config - Search configuration
 * @returns {Object} SearchAPI searcher instance
 */
export function createSearchApiSearcher(config) {
  const adapter = new SearchApiAdapter(config);
  // Create searcher with all required parameters
  return new Searcher(adapter, null, null, null, null, config, config.searchEngine);
}
