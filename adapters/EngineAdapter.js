/**
 * Abstract base class for search engine adapters
 */
export class EngineAdapter {
  /**
   * Create an EngineAdapter
   */
  constructor() {
    if (this.constructor === EngineAdapter) {
      throw new Error('EngineAdapter is abstract and cannot be instantiated directly');
    }
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
