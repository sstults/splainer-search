/**
 * Factory for creating Algolia searchers
 */
import { AlgoliaAdapter } from '../adapters/algolia/AlgoliaAdapter.js';
import { Searcher } from '../core/Searcher.js';

/**
 * Create an algolia searcher
 * @param {Object} config - Search configuration
 * @returns {Object} Algolia searcher instance
 */
export function createAlgoliaSearcher(config) {
  const adapter = new AlgoliaAdapter(config);
  // Create searcher with all required parameters
  return new Searcher(adapter, null, null, null, null, config, config.searchEngine);
}
