/**
 * Vectara search engine adapter
 */
import { EngineAdapter } from '../EngineAdapter.js';

export class VectaraAdapter extends EngineAdapter {
  /**
   * Create a Vectara adapter
   * @param {Object} config - Search configuration
   */
  constructor(config) {
    super(config);
  }

  /**
   * Perform a search against Vectara
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results
   */
  async search(searchParams) {
    // Make actual HTTP request to Vectara API
    const url = 'https://api.vectara.io/v1/query';
    
    const requestBody = {
      query: searchParams.q,
      numResults: searchParams.numResults || 10,
      start: searchParams.start || 0,
      customerId: this.config.customerId,
      corpusId: this.config.corpusId,
      apiKey: this.config.apiKey
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.config.apiKey
      },
      body: JSON.stringify(requestBody)
    });

    // Handle case where response might not be ok
    if (!response.ok) {
      throw new Error(`Vectara API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform Vectara response to standard format
    return {
      docs: data.response || [],
      total: data.total || 0,
      took: data.took || 0
    };
  }
}
