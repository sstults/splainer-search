import { EngineAdapter } from '../EngineAdapter.js';

export class SearchApiAdapter extends EngineAdapter {
  constructor(config) {
    super(config);
  }

  /**
   * Search method for Search API
   * @param {Object} searchParams - Search parameters
   * @returns {Object} Search results
   */
  async search(searchParams) {
    // Create Search API search URL
    const baseUrl = this.config.url || this.config.baseUrl || '';
    const searchUrl = baseUrl.endsWith('/search') ? baseUrl : `${baseUrl}/search`;
    
    // Convert 'q' parameter to 'query' for Search API
    const apiParams = { ...searchParams };
    if (apiParams.size === undefined && this.config.rows !== undefined) {
      apiParams.size = this.config.rows;
    }
    if (apiParams.q !== undefined) {
      apiParams.query = apiParams.q;
      delete apiParams.q;
    }
    
    // Perform search using transport
    let response = {};
    if (this.transport && typeof this.transport.get === 'function') {
      response = await this.transport.get(searchUrl, apiParams) || {};
    }
    
    // Transform response to match expected structure
    return {
      hits: response.hits || response.results || [],
      total: response.total || response.hits?.length || 0,
      took: response.took || 0,
      docs: response.hits?.map(hit => ({
        id: hit.id || hit._id,
        ...hit
      })) || []
    };
  }

  /**
   * Get document by ID for Search API
   * @param {string} id - Document ID
   * @returns {Object} Document
   */
  async getDoc(id) {
    // Create Search API document URL
    const baseUrl = this.config.url || this.config.baseUrl || '';
    const rootUrl = baseUrl.endsWith('/search') ? baseUrl.slice(0, -'/search'.length) : baseUrl;
    const docUrl = `${rootUrl}/documents/${id}`;
    
    // Perform document retrieval using transport
    let response = {};
    if (this.transport && typeof this.transport.get === 'function') {
      response = await this.transport.get(docUrl) || {};
    }
    
    // Transform response to match expected structure
    return {
      id: response.id || response._id,
      ...response
    };
  }
}
