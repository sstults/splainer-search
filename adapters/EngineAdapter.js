/**
 * Abstract base class for search engine adapters
 */
export class EngineAdapter {
  /**
   * Create an EngineAdapter
   */
  constructor(config) {
    if (this.constructor === EngineAdapter) {
      throw new Error('EngineAdapter is abstract and cannot be instantiated directly');
    }
    this.config = config || {};
  }

  /**
   * Perform a search against the engine
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results
   */
  async search(searchParams) {
    throw new Error('Search method must be implemented by concrete adapter');
  }
}
