import { describe, it, expect } from 'vitest';
import { search, doc, resolver } from '../../../api/index.js';

describe('api/index', () => {
  describe('api/index', () => {
    it('should export search function', () => {
      expect(search).toBeDefined();
    });

    it('should export doc function', () => {
      expect(doc).toBeDefined();
    });

    it('should export resolver function', () => {
      expect(resolver).toBeDefined();
    });

    it('should create searcher with solr engine', () => {
      const searcher = search({ url: 'http://localhost:8983/solr/collection1' }, 'solr');
      expect(searcher).toBeDefined();
      expect(searcher.searchEngine).toBe('solr');
    });

    it('should create searcher with elasticsearch engine', () => {
      const searcher = search({ url: 'http://localhost:9200/index' }, 'elasticsearch');
      expect(searcher).toBeDefined();
      expect(searcher.searchEngine).toBe('elasticsearch');
    });

    it('should create searcher with algolia engine', () => {
      const searcher = search({ appId: 'test-app', apiKey: 'test-key', index: 'test-index' }, 'algolia');
      expect(searcher).toBeDefined();
      expect(searcher.searchEngine).toBe('algolia');
    });

    it('should create searcher with vectara engine', () => {
      const searcher = search({ customerId: 'test-customer', apiKey: 'test-key', corpusId: 'test-corpus' }, 'vectara');
      expect(searcher).toBeDefined();
      expect(searcher.searchEngine).toBe('vectara');
    });

    it('should create searcher with searchapi engine', () => {
      const searcher = search({ url: 'http://localhost:8080/api' }, 'searchapi');
      expect(searcher).toBeDefined();
      expect(searcher.searchEngine).toBe('searchapi');
    });
  });
});
