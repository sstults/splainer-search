/**
 * Factory for creating searchers - this is the main factory that delegates to engine-specific factories
 */
import { createSolrSearcher } from './solrSearcherFactory.js';
import { createEsSearcher } from './esSearcherFactory.js';
import { createAlgoliaSearcher } from './algoliaSearchFactory.js';
import { createVectaraSearcher } from './vectaraSearcherFactory.js';
import { createSearchApiSearcher } from './searchApiSearcherFactory.js';

/**
 * Create a searcher based on search engine type
 * @param {Array} fields - Search fields
 * @param {string} url - Search URL
 * @param {Object} params - Search parameters
 * @param {string} queryText - Query text
 * @param {Object} config - Search configuration
 * @param {string} searchEngine - Search engine type (solr, elasticsearch, algolia, vectara, searchapi)
 * @returns {Object} Searcher instance
 */
export function createSearcher(fields, url, params, queryText, config, searchEngine) {
  // Set search engine type in config
  config.searchEngine = searchEngine;
  
  // Delegate to engine-specific factory based on search engine type
  switch (searchEngine) {
  case 'solr':
    return createSolrSearcher(config);
  case 'elasticsearch':
    return createEsSearcher(config);
  case 'algolia':
    return createAlgoliaSearcher(config);
  case 'vectara':
    return createVectaraSearcher(config);
  case 'searchapi':
    return createSearchApiSearcher(config);
  default:
    // Fallback to generic searcher creation - but avoid circular import
    // For now, return null or throw error for unsupported engines
    throw new Error(`Unsupported search engine: ${searchEngine}`);
  }
}
