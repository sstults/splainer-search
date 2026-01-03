/**
 * Factory for creating docs
 */
import { Doc } from '../core/Doc.js';

/**
 * Create a doc instance
 * @param {Object} source - Document source
 * @param {Object} highlight - Highlight information
 * @param {string} searchEngine - Search engine type (solr, elasticsearch, algolia, vectara, searchapi)
 * @returns {Object} Doc instance
 */
export function createDoc(source, highlight, searchEngine) {
  // Create doc instance
  const docInstance = new Doc({ source, highlight, explain: null });
  
  // Return doc instance
  return docInstance;
}
