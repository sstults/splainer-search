/**
 * Factory for creating Elasticsearch searchers
 */
import { EsAdapter } from '../../adapters/elasticsearch/EsAdapter.js';
import { Searcher } from '../../core/Searcher.js';

/**
 * Create an elasticsearch searcher
 * @param {Object} config - Search configuration
 * @returns {Object} Elasticsearch searcher instance
 */
export function createEsSearcher(config) {
  const adapter = new EsAdapter(config);
  // Create searcher with all required parameters
  return new Searcher(adapter, null, null, null, null, config, config.searchEngine);
}
