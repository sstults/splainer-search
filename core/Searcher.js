/**
 * Orchestrates search operations and manages results
 */
export class Searcher {
  /**
   * Create a Searcher
   * @param {EngineAdapter} adapter - Search engine adapter
   * @param {Array} fields - Field mappings
   * @param {string} url - Search endpoint URL
   * @param {Object} params - Search parameters
   * @param {string} queryText - Search query text
   * @param {Object} config - Search configuration
   * @param {string} searchEngine - Search engine type
   */
  constructor(adapter, fields, url, params, queryText, config, searchEngine) {
    this.adapter = adapter;
    this.fields = fields;
    this.url = url;
    this.params = params;
    this.queryText = queryText;
    this.config = config;
    this.searchEngine = searchEngine;
    this.docs = [];
    this.total = 0;
    this.pageState = null;
    
    // Set up transport on the adapter if needed
    if (config && config.transport) {
      this.adapter.transport = config.transport;
    }
  }

  /**
   * Perform a search
   * @returns {Promise<void>} Promise that resolves when search is complete
   */
  async search() {
    try {
      // Prepare search parameters
      const searchParams = {
        ...this.params,
        q: this.queryText
      };

      // Delegate to adapter
      const results = await this.adapter.search(searchParams);
      
      // Process results
      this.docs = results.docs || [];
      this.total = results.total || 0;
      
      return results;
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Create a new searcher for the next page
   * @returns {Searcher} New searcher instance for next page
   */
  pager() {
    // Create a new searcher for the next page
    const newSearcher = new Searcher(
      this.adapter,
      this.fields,
      this.url,
      this.params,
      this.queryText,
      this.config,
      this.searchEngine
    );
    
    // Update page state for pagination
    if (this.pageState) {
      newSearcher.pageState = { ...this.pageState };
    }
    
    return newSearcher;
  }
}
