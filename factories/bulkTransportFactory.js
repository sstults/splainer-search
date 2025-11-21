'use strict';

/**
 * Bulk Transport factory for processing multiple operations
 */
export function bulkTransportFactory() {
  /**
   * Bulk transport object
   * @param {Object} transport - The underlying transport to use for individual operations
   */
  var BulkTransporter = function(transport) {
    var self = this;
    
    // Store the underlying transport
    self.transport = transport;
    
    /**
     * Process multiple operations in bulk
     * @param {Array} operations - Array of operation objects
     * @returns {Promise} Promise that resolves with results of all operations
     */
    self.bulk = function(operations) {
      // Validate input
      if (!Array.isArray(operations)) {
        return Promise.reject(new Error('Operations must be an array'));
      }
      
      // Create an array of promises for all operations
      var promises = operations.map(function(operation) {
        // Validate each operation
        if (!operation || !operation.url) {
          return Promise.reject(new Error('Each operation must have a url'));
        }
        
        // Determine the method and call the appropriate transport method
        var method = (operation.method || 'GET').toUpperCase();
        var payload = operation.payload || null;
        var headers = operation.headers || {};
        
        // Call the appropriate transport method based on the operation type
        switch (method) {
          case 'GET':
            return self.transport.get(operation.url, headers);
          case 'POST':
            return self.transport.post(operation.url, payload, headers);
          case 'PUT':
            return self.transport.put(operation.url, payload, headers);
          case 'DELETE':
            return self.transport.delete(operation.url, headers);
          case 'JSONP':
            return self.transport.jsonp(operation.url, headers);
          default:
            // For unknown methods, try to use the generic query method
            return self.transport.query(operation.url, payload, headers);
        }
      });
      
      // Execute all promises and return the results
      return Promise.all(promises);
    };
  };

  // Return factory object
  return BulkTransporter;
}
