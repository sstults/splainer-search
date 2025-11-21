/**
 * Public API for splainer-search
 */
import { createSearcher as createSearcherFromFactory } from '../factories/searcherFactory.js';
import { createDoc } from '../factories/docFactory.js';
import { createResolver } from '../factories/resolverFactory.js';

export { createSearcherFromFactory as createSearcher, createResolver, createDoc };

// Export the functions directly for backward compatibility
export const search = function(config, searchEngine) {
  // Create a minimal config that has the searchEngine property
  const newConfig = Object.assign({}, config);
  newConfig.searchEngine = searchEngine;
  
  // Call the factory function with the correct parameters
  const result = createSearcherFromFactory(null, null, null, null, newConfig, searchEngine);
  return result;
};

export const resolver = createResolver;
export const doc = createDoc;
