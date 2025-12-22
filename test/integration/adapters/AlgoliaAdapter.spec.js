import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlgoliaAdapter } from '../../../adapters/algolia/AlgoliaAdapter.js';
import { Searcher } from '../../../core/Searcher.js';

describe('AlgoliaAdapter Integration', () => {
  let adapter;
  
  beforeEach(() => {
    adapter = new AlgoliaAdapter({
      appId: 'test-app-id',
      apiKey: 'test-api-key',
      indexName: 'test_index'
    });
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(adapter.config).toEqual({
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        indexName: 'test_index'
      });
    });
  });

  describe('search method', () => {
    it('should return expected search results structure', async () => {
      const searchParams = {
        query: 'test query',
        hitsPerPage: 10,
        page: 0
      };
      
      const result = await adapter.search(searchParams);
      
      expect(result).toHaveProperty('hits');
      expect(result).toHaveProperty('nbHits');
      expect(result).toHaveProperty('processingTimeMS');
    });

    it('should handle different search parameters', async () => {
      const testParams = [
        { query: 'simple query', hitsPerPage: 5, page: 0 },
        { query: 'complex query with filters', hitsPerPage: 20, page: 1 },
        { query: '', hitsPerPage: 100, page: 0 },
        { query: 'query with special chars: + - && || ! ( ) { } [ ] ^ " ~ * ? : \\ /', hitsPerPage: 10, page: 0 }
      ];

      for (const params of testParams) {
        const result = await adapter.search(params);
        expect(result).toHaveProperty('hits');
        expect(result).toHaveProperty('nbHits');
        expect(result).toHaveProperty('processingTimeMS');
      }
    });

    it('should maintain adapter state between searches', async () => {
      const firstResult = await adapter.search({ query: 'first query' });
      const secondResult = await adapter.search({ query: 'second query' });
      
      // Both should return valid results
      expect(firstResult).toHaveProperty('hits');
      expect(secondResult).toHaveProperty('hits');
    });
  });

  describe('integration with Searcher', () => {
    it('should work correctly with Searcher class', async () => {
      const searcher = new Searcher(
        adapter,
        ['title', 'content'],
        'https://test-app-id.algolia.net/1/indexes/test_index/search',
        { hitsPerPage: 10, page: 0 },
        'test query',
        { transport: 'http' },
        'algolia'
      );
      
      // Mock the adapter search method to return consistent results
      const mockSearch = vi.spyOn(adapter, 'search');
      mockSearch.mockResolvedValue({
        hits: [
          { objectID: '1', title: 'Test Document 1', content: 'This is test content 1' },
          { objectID: '2', title: 'Test Document 2', content: 'This is test content 2' }
        ],
        nbHits: 2,
        processingTimeMS: 5
      });
      
      const result = await searcher.search();
      
      expect(mockSearch).toHaveBeenCalledWith({
        query: 'test query',
        hitsPerPage: 10,
        page: 0
      });
      
      expect(result.docs).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
