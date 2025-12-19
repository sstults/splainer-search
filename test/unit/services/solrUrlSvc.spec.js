import { describe, it, expect } from 'vitest';
import { solrUrlSvc } from '../../../services/solrUrlSvc.js';

describe('solrUrlSvc', () => {
  const solrUrlService = new solrUrlSvc();

  describe('buildUrl', () => {
    it('should build URL with query parameters correctly', () => {
      const url = 'http://localhost:8983/solr/mycollection';
      const urlArgs = {
        q: ['*:*'],
        fq: ['title:foo', 'text:bar']
      };
      const result = solrUrlService.buildUrl(url, urlArgs);
      
      expect(result).toBe('http://localhost:8983/solr/mycollection?q=*:*&fq=title:foo&fq=text:bar');
    });
  });

  describe('formatSolrArgs', () => {
    it('should format Solr arguments correctly', () => {
      const argsObj = {
        q: ['*:*'],
        fq: ['title:foo', 'text:bar']
      };
      const result = solrUrlService.formatSolrArgs(argsObj);
      
      expect(result).toBe('q=*:*&fq=title:foo&fq=text:bar');
    });

    it('should handle string values correctly', () => {
      const argsObj = {
        q: '*:*'
      };
      const result = solrUrlService.formatSolrArgs(argsObj);
      
      expect(result).toBe('q=*:*');
    });
  });

  describe('parseSolrArgs', () => {
    it('should parse Solr arguments correctly', () => {
      const argsStr = 'q=*:*&fq=title:foo&fq=text:bar';
      const result = solrUrlService.parseSolrArgs(argsStr);
      
      expect(result.q).toEqual(['*:*']);
      expect(result.fq).toEqual(['title:foo', 'text:bar']);
    });

    it('should handle URL decoding correctly', () => {
      const argsStr = 'q=hello%20world';
      const result = solrUrlService.parseSolrArgs(argsStr);
      
      expect(result.q).toEqual(['hello world']);
    });
  });

  describe('parseSolrPath', () => {
    it('should parse Solr path correctly', () => {
      const pathStr = '/solr/mycollection/_search';
      const result = solrUrlService.parseSolrPath(pathStr);
      
      expect(result.requestHandler).toBe('_search');
      expect(result.collectionName).toBe('mycollection');
    });

    it('should handle invalid path correctly', () => {
      const pathStr = '/invalid/path';
      const result = solrUrlService.parseSolrPath(pathStr);
      
      // The function doesn't return null for invalid paths, it returns an object
      // with the last two components as requestHandler and collectionName
      expect(result.requestHandler).toBe('path');
      expect(result.collectionName).toBe('invalid');
    });
  });

  describe('parseSolrUrl', () => {
    it('should parse Solr URL correctly', () => {
      const solrReq = 'http://localhost:8983/solr/mycollection/_search?q=*:*';
      const result = solrUrlService.parseSolrUrl(solrReq);
      
      expect(result.protocol).toBe('http:');
      expect(result.host).toBe('localhost:8983');
      expect(result.collectionName).toBe('mycollection');
      expect(result.requestHandler).toBe('_search');
      expect(result.solrArgs.q).toEqual(['*:*']);
    });

    it('should handle missing protocol', () => {
      const solrReq = 'localhost:8983/solr/mycollection/_search';
      const result = solrUrlService.parseSolrUrl(solrReq);
      
      expect(result.protocol).toBe('http:');
      expect(result.host).toBe('localhost:8983');
    });
  });

  describe('escapeUserQuery', () => {
    it('should escape special characters in query', () => {
      const queryText = 'hello:world';
      const result = solrUrlService.escapeUserQuery(queryText);
      
      expect(result).toBe('hello\\:world');
    });

    it('should escape multiple special characters', () => {
      const queryText = 'hello+world&test';
      const result = solrUrlService.escapeUserQuery(queryText);
      
      expect(result).toBe('hello\\+world\\&test');
    });
  });

  describe('removeUnsupported', () => {
    it('should remove unsupported arguments', () => {
      const solrArgs = {
        'json.wrf': 'callback',
        facet: 'true',
        'facet.field': 'title',
        fl: 'id,title',
        hl: 'true',
        'hl.simple.pre': '<b>',
        'hl.simple.post': '</b>',
        wt: 'json',
        debug: 'true'
      };
      const warnings = solrUrlService.removeUnsupported(solrArgs);
      
      expect(solrArgs['json.wrf']).toBeUndefined();
      expect(solrArgs.facet).toBeUndefined();
      expect(solrArgs['facet.field']).toBeUndefined();
      expect(solrArgs.fl).toBeUndefined();
      expect(solrArgs.hl).toBeUndefined();
      expect(solrArgs['hl.simple.pre']).toBeUndefined();
      expect(solrArgs['hl.simple.post']).toBeUndefined();
      expect(solrArgs.wt).toBeUndefined();
      expect(solrArgs.debug).toBeUndefined();
    });
  });

  describe('parseSolrArgs with invalid URI', () => {
    it('should handle URI decoding errors gracefully', () => {
      // This test ensures the URI decoding error handling works
      const argsStr = 'q=hello%20world&invalid=%';
      const result = solrUrlService.parseSolrArgs(argsStr);
      
      expect(result.q).toEqual(['hello world']);
      expect(result.invalid).toEqual(['%']); // Should not crash on invalid percent encoding
    });
  });

  describe('parseSolrPath with edge cases', () => {
    it('should handle empty path correctly', () => {
      const pathStr = '';
      const result = solrUrlService.parseSolrPath(pathStr);
      
      expect(result).toBeNull();
    });

    it('should handle single component path correctly', () => {
      const pathStr = 'single';
      const result = solrUrlService.parseSolrPath(pathStr);
      
      expect(result).toBeNull();
    });
  });

  describe('parseSolrUrl with edge cases', () => {
    it('should handle invalid path in URL correctly', () => {
      const solrReq = 'http://localhost:8983/invalid';
      const result = solrUrlService.parseSolrUrl(solrReq);
      
      expect(result).toBeNull();
    });

    it('should handle URL without proper path components', () => {
      const solrReq = 'http://localhost:8983/';
      const result = solrUrlService.parseSolrUrl(solrReq);
      
      expect(result).toBeNull();
    });
  });
});
