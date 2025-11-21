import { EngineAdapter } from '../EngineAdapter.js';

export class SearchApiAdapter extends EngineAdapter {
  constructor(config) {
    super();
    this.config = config || {};
  }

  /**
   * Search method for Search API
   * @param {string} queryText - Query text
   * @param {Object} params - Search parameters
   * @returns {Object} Search results
   */
  search(queryText, params) {
    // Create Search API search URL
    const searchUrl = `${this.config.url}/search`;
    
    // Prepare search parameters
    const searchParams = {
      query: queryText,
      ...params,
      size: this.config.rows || 10
    };
    
    // Perform search using transport
    return this.transport.get(searchUrl, searchParams);
  }

  /**
   * Get document by ID for Search API
   * @param {string} id - Document ID
   * @returns {Object} Document
   */
  getDoc(id) {
    // Create Search API document URL
    const docUrl = `${this.config.url}/documents/${id}`;
    
    // Perform document retrieval using transport
    return this.transport.get(docUrl);
  }
}
