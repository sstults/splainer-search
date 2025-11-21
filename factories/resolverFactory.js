/**
 * Factory for creating resolvers
 */
import DocResolver from '../services/docResolverSvc.js';

/**
 * Create a resolver instance
 * @param {Object} config - Search configuration
 * @param {string} searchEngine - Search engine type (solr, elasticsearch, algolia, vectara, searchapi)
 * @returns {Object} Resolver instance
 */
export function createResolver(config, searchEngine) {
  // Set search engine type in config
  config.searchEngine = searchEngine;
  
  // Create resolver instance
  const resolverInstance = new DocResolver(config);
  
  // Return resolver instance
  return resolverInstance;
}
