import { bulkTransportFactory } from '../../factories/bulkTransportFactory.js';

describe('bulkTransportFactory', function() {
  var transport;
  var bulkTransport;

  beforeEach(function() {
    // Create a mock transport object
    transport = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      jsonp: vi.fn(),
      query: vi.fn()
    };

    // Create the bulk transport
    bulkTransport = new bulkTransportFactory()(transport);
  });

  it('should create a bulk transport object', function() {
    expect(bulkTransport).toBeDefined();
    expect(bulkTransport.bulk).toBeDefined();
  });

  it('should reject when operations is not an array', function(done) {
    bulkTransport.bulk('not an array')
      .then(function() {
        fail('Should have rejected');
      })
      .catch(function(error) {
        expect(error.message).toBe('Operations must be an array');
        done();
      });
  });

  it('should reject when an operation does not have a url', function(done) {
    bulkTransport.bulk([{ method: 'GET' }])
      .then(function() {
        fail('Should have rejected');
      })
      .catch(function(error) {
        expect(error.message).toBe('Each operation must have a url');
        done();
      });
  });

  it('should handle GET operations', function(done) {
    transport.get.mockResolvedValue({ data: 'get result' });
    
    bulkTransport.bulk([
      { url: '/api/test1', method: 'GET' },
      { url: '/api/test2', method: 'GET' }
    ])
    .then(function(results) {
      expect(transport.get).toHaveBeenCalledTimes(2);
      expect(results.length).toBe(2);
      done();
    })
    .catch(function(error) {
      fail('Should not have rejected: ' + error);
      done();
    });
  });

  it('should handle POST operations', function(done) {
    transport.post.mockResolvedValue({ data: 'post result' });
    
    bulkTransport.bulk([
      { url: '/api/test1', method: 'POST', payload: { key: 'value' } },
      { url: '/api/test2', method: 'POST', payload: { key: 'value2' } }
    ])
    .then(function(results) {
      expect(transport.post).toHaveBeenCalledTimes(2);
      expect(results.length).toBe(2);
      done();
    })
    .catch(function(error) {
      fail('Should not have rejected: ' + error);
      done();
    });
  });

  it('should handle PUT operations', function(done) {
    transport.put.mockResolvedValue({ data: 'put result' });
    
    bulkTransport.bulk([
      { url: '/api/test1', method: 'PUT', payload: { key: 'value' } },
      { url: '/api/test2', method: 'PUT', payload: { key: 'value2' } }
    ])
    .then(function(results) {
      expect(transport.put).toHaveBeenCalledTimes(2);
      expect(results.length).toBe(2);
      done();
    })
    .catch(function(error) {
      fail('Should not have rejected: ' + error);
      done();
    });
  });

  it('should handle DELETE operations', function(done) {
    transport.delete.mockResolvedValue({ data: 'delete result' });
    
    bulkTransport.bulk([
      { url: '/api/test1', method: 'DELETE' },
      { url: '/api/test2', method: 'DELETE' }
    ])
    .then(function(results) {
      expect(transport.delete).toHaveBeenCalledTimes(2);
      expect(results.length).toBe(2);
      done();
    })
    .catch(function(error) {
      fail('Should not have rejected: ' + error);
      done();
    });
  });

  it('should handle JSONP operations', function(done) {
    transport.jsonp.mockResolvedValue({ data: 'jsonp result' });
    
    bulkTransport.bulk([
      { url: '/api/test1', method: 'JSONP' },
      { url: '/api/test2', method: 'JSONP' }
    ])
    .then(function(results) {
      expect(transport.jsonp).toHaveBeenCalledTimes(2);
      expect(results.length).toBe(2);
      done();
    })
    .catch(function(error) {
      fail('Should not have rejected: ' + error);
      done();
    });
  });

  it('should handle unknown operations with query method', function(done) {
    transport.query.mockResolvedValue({ data: 'query result' });
    
    bulkTransport.bulk([
      { url: '/api/test1', method: 'UNKNOWN' },
      { url: '/api/test2', method: 'UNKNOWN' }
    ])
    .then(function(results) {
      expect(transport.query).toHaveBeenCalledTimes(2);
      expect(results.length).toBe(2);
      done();
    })
    .catch(function(error) {
      fail('Should not have rejected: ' + error);
      done();
    });
  });

  it('should handle operations with headers', function(done) {
    transport.get.mockResolvedValue({ data: 'get result' });
    
    bulkTransport.bulk([
      { url: '/api/test1', method: 'GET', headers: { 'Authorization': 'Bearer token1' } },
      { url: '/api/test2', method: 'GET', headers: { 'Authorization': 'Bearer token2' } }
    ])
    .then(function(results) {
      expect(transport.get).toHaveBeenCalledTimes(2);
      expect(results.length).toBe(2);
      done();
    })
    .catch(function(error) {
      fail('Should not have rejected: ' + error);
      done();
    });
  });

  it('should handle mixed operation types', function(done) {
    transport.get.mockResolvedValue({ data: 'get result' });
    transport.post.mockResolvedValue({ data: 'post result' });
    
    bulkTransport.bulk([
      { url: '/api/test1', method: 'GET' },
      { url: '/api/test2', method: 'POST', payload: { key: 'value' } }
    ])
    .then(function(results) {
      expect(transport.get).toHaveBeenCalledTimes(1);
      expect(transport.post).toHaveBeenCalledTimes(1);
      expect(results.length).toBe(2);
      done();
    })
    .catch(function(error) {
      fail('Should not have rejected: ' + error);
      done();
    });
  });
});
