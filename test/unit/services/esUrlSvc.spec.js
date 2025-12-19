import { describe, it, expect } from 'vitest';
import { esUrlSvc } from '../../../services/esUrlSvc.js';

describe('esUrlSvc', () => {
  const esUrlService = new esUrlSvc();

  describe('parseUrl', () => {
    it('should parse URL with http protocol', () => {
      const url = 'http://localhost:9200/myindex/_search';
      const result = esUrlService.parseUrl(url);
      
      expect(result.protocol).toBe('http:');
      expect(result.host).toBe('localhost:9200');
      expect(result.pathname).toBe('/myindex/_search');
    });

    it('should parse URL with missing protocol', () => {
      const url = 'localhost:9200/myindex/_search';
      const result = esUrlService.parseUrl(url);
      
      expect(result.protocol).toBe('http:');
      expect(result.host).toBe('localhost:9200');
    });

    it('should parse URL with https protocol', () => {
      const url = 'https://localhost:9200/myindex/_search';
      const result = esUrlService.parseUrl(url);
      
      expect(result.protocol).toBe('https:');
      expect(result.host).toBe('localhost:9200');
    });

    it('should parse URL with username and password', () => {
      const url = 'http://user:pass@localhost:9200/myindex/_search';
      const result = esUrlService.parseUrl(url);
      
      expect(result.username).toBe('user');
      expect(result.password).toBe('pass');
      expect(result.host).toBe('localhost:9200');
    });
  });

  describe('buildBaseUrl', () => {
    it('should build base URL correctly', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200'
      };
      const result = esUrlService.buildBaseUrl(uri);
      
      expect(result).toBe('http://localhost:9200');
    });
  });

  describe('buildDocUrl', () => {
    it('should build document URL correctly', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_doc'
      };
      const doc = {
        _index: 'myindex',
        _type: '_doc',
        _id: '123'
      };
      const result = esUrlService.buildDocUrl(uri, doc);
      
      expect(result).toBe('http://localhost:9200/myindex/_doc/123?pretty=true');
    });

    it('should build explain URL correctly', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_doc'
      };
      const doc = {
        _index: 'myindex',
        _type: '_doc',
        _id: '123'
      };
      const result = esUrlService.buildDocUrl(uri, doc, true);
      
      expect(result).toBe('http://localhost:9200/myindex/_explain/123');
    });
  });

  describe('buildExplainUrl', () => {
    it('should build explain URL correctly', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_doc'
      };
      const doc = {
        _index: 'myindex',
        _type: '_doc',
        _id: '123'
      };
      const result = esUrlService.buildExplainUrl(uri, doc);
      
      expect(result).toBe('http://localhost:9200/myindex/_explain/123');
    });
  });

  describe('buildRenderTemplateUrl', () => {
    it('should build render template URL correctly', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_doc'
      };
      const result = esUrlService.buildRenderTemplateUrl(uri);
      
      expect(result).toBe('http://localhost:9200/_render/template');
    });
  });

  describe('buildUrl', () => {
    it('should build URL with parameters correctly', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_search',
        params: {
          from: '10',
          size: '10'
        }
      };
      const result = esUrlService.buildUrl(uri);
      
      expect(result).toBe('http://localhost:9200/myindex/_search?from=10&size=10');
    });

    it('should handle when no params to append', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_search'
      };
      const result = esUrlService.buildUrl(uri);
      
      expect(result).toBe('http://localhost:9200/myindex/_search');
    });

    it('should handle when params are empty', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_search',
        params: {}
      };
      const result = esUrlService.buildUrl(uri);
      
      expect(result).toBe('http://localhost:9200/myindex/_search');
    });

    it('should handle when query is provided', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_search',
        query: 'q=hello'
      };
      const result = esUrlService.buildUrl(uri);
      
      expect(result).toBe('http://localhost:9200/myindex/_search?q=hello');
    });

    it('should handle when both params and query are provided', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_search',
        params: {
          from: '10'
        },
        query: 'q=hello'
      };
      const result = esUrlService.buildUrl(uri);
      
      expect(result).toBe('http://localhost:9200/myindex/_search?from=10&q=hello');
    });

    it('should handle when pathname ends with /', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_search/',
        params: {
          from: '10'
        }
      };
      const result = esUrlService.buildUrl(uri);
      
      expect(result).toBe('http://localhost:9200/myindex/_search?from=10');
    });
  });

  describe('isBulkCall', () => {
    it('should identify bulk calls correctly', () => {
      const uri = {
        pathname: '/myindex/_msearch'
      };
      const result = esUrlService.isBulkCall(uri);
      
      expect(result).toBe(true);
    });

    it('should identify non-bulk calls correctly', () => {
      const uri = {
        pathname: '/myindex/_search'
      };
      const result = esUrlService.isBulkCall(uri);
      
      expect(result).toBe(false);
    });
  });

  describe('isTemplateCall', () => {
    it('should identify template calls correctly', () => {
      const args = {
        id: 'my-template'
      };
      const result = esUrlService.isTemplateCall(args);
      
      expect(result).toBe(true);
    });

    it('should identify non-template calls correctly', () => {
      const args = {};
      const result = esUrlService.isTemplateCall(args);
      
      expect(result).toBe(false);
    });

    it('should identify template calls correctly with null args', () => {
      const args = null;
      const result = esUrlService.isTemplateCall(args);
      
      expect(result).toBe(false);
    });
  });

  describe('stripBasicAuth', () => {
    it('should strip basic auth from URL', () => {
      const url = 'http://user:pass@localhost:9200/myindex/_search';
      const result = esUrlService.stripBasicAuth(url);
      
      expect(result).toBe('http://localhost:9200/myindex/_search');
    });
  });

  describe('getHeaders', () => {
    it('should return custom headers when provided', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200'
      };
      const customHeaders = '{"Authorization": "Bearer token123"}';
      const result = esUrlService.getHeaders(uri, customHeaders);
      
      expect(result.Authorization).toBe('Bearer token123');
    });

    it('should return basic auth headers when no custom headers', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        username: 'user',
        password: 'pass'
      };
      const result = esUrlService.getHeaders(uri);
      
      expect(result.Authorization).toBe('Basic dXNlcjpwYXNz');
    });

    it('should return empty headers when no auth info', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200'
      };
      const result = esUrlService.getHeaders(uri);
      
      expect(result).toEqual({});
    });
  });

  describe('setParams', () => {
    it('should set parameters correctly', () => {
      const uri = {
        protocol: 'http:',
        host: 'localhost:9200',
        pathname: '/myindex/_search'
      };
      const params = {
        from: '10',
        size: '10'
      };
      esUrlService.setParams(uri, params);
      
      expect(uri.params).toEqual(params);
    });
  });
});
