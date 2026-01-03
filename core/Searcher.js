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
      const queryKey = ['algolia', 'searchapi'].includes(this.searchEngine) ? 'query' : 'q';
      const searchParams = {
        ...this.params,
        [queryKey]: this.queryText
      };

      // Delegate to adapter
      const results = await this.adapter.search(searchParams);

      const docsFromHits = (hits) => {
        if (!Array.isArray(hits)) {
          return [];
        }
        return hits.map((hit) => hit?._source || hit);
      };

      let docs = results.docs;
      if (docs === undefined && Array.isArray(results.hits?.hits)) {
        docs = docsFromHits(results.hits.hits);
      }
      if (docs === undefined && Array.isArray(results.hits)) {
        docs = docsFromHits(results.hits);
      }
      if (docs === undefined && Array.isArray(results.results)) {
        docs = docsFromHits(results.results);
      }
      if (docs === undefined) {
        docs = [];
      }

      const total = results.total
        ?? results.hits?.total?.value
        ?? results.hits?.total
        ?? results.nbHits
        ?? docs.length;

      const normalized = {
        ...results,
        docs,
        total,
        engine: this.searchEngine
      };

      // Process results
      this.docs = docs;
      this.total = total;
      
      return normalized;
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
