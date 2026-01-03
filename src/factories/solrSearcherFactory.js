/**
 * Factory for creating Solr searchers
 */
import { SolrAdapter } from '../adapters/solr/SolrAdapter.js';
import { Searcher } from '../core/Searcher.js';

/**
 * Create a solr searcher
 * @param {Object} config - Search configuration
 * @returns {Object} Solr searcher instance
 */
export function createSolrSearcher(config) {
  const adapter = new SolrAdapter(config);
  // Create searcher with all required parameters
  return new Searcher(adapter, null, null, null, null, config, config.searchEngine);
}
