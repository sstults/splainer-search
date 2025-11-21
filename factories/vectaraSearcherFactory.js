/**
 * Factory for creating Vectara searchers
 */
import { VectaraAdapter } from '../adapters/vectara/VectaraAdapter.js';
import { Searcher } from '../core/Searcher.js';

/**
 * Create a vectara searcher
 * @param {Object} config - Search configuration
 * @returns {Object} Vectara searcher instance
 */
export function createVectaraSearcher(config) {
  const adapter = new VectaraAdapter(config);
  // Create searcher with all required parameters
  return new Searcher(adapter, null, null, null, null, config, config.searchEngine);
}
