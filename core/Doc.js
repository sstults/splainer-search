/**
 * Represents a search result document
 */
export class Doc {
  /**
   * @param {Object} data - The raw document data
   * @param {Object} data.source - The raw document source
   * @param {Object} data.highlight - Highlight information
   * @param {Object} data.explain - Explain information
   */
  constructor({ source, highlight, explain }) {
    this._source = source || {};
    this._highlight = highlight || {};
    this._explain = explain || null;
  }

  /**
   * Returns the normalized source map
   * @returns {Object} The document source
   */
  source() {
    return this._source;
  }

  /**
   * Gets highlighted text for a field
   * @param {string} id - Document ID
   * @param {string} field - Field name
   * @param {string} pre - Pre tag
   * @param {string} post - Post tag
   * @returns {string|Array} Highlighted text or empty string
   */
  highlight(id, field, pre, post) {
    if (!this._highlight || !this._highlight[id] || !this._highlight[id][field]) {
      return '';
    }
    
    const highlights = this._highlight[id][field];
    if (Array.isArray(highlights)) {
      // For multiple fragments, wrap each with pre/post tags
      // For single fragment with HTML tags, return as-is
      // For single fragment without HTML tags, wrap with pre/post tags
      return highlights.map(fragment => {
        // Check if fragment already contains HTML tags
        if (typeof fragment === 'string' && fragment.includes('<')) {
          return fragment; // Return as-is if it already has HTML tags
        }
        return `${pre}${fragment}${post}`;
      }).join(' ');
    }
    
    return highlights;
  }

  /**
   * Gets explain information for a document
   * @param {string} id - Document ID
   * @returns {Object|null} Explain information or throws NotSupportedError
   * @throws {Error} If explain is not supported
   */
  explain(id) {
    if (this._explain && this._explain[id]) {
      return this._explain[id];
    }
    
    throw new Error('NotSupported');
  }
}
