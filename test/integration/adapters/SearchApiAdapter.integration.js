import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchApiAdapter } from '../../../adapters/searchApi/SearchApiAdapter.js';
import { Searcher } from '../../../core/Searcher.js';

describe('SearchApiAdapter Integration', () => {
  let adapter;
  
  beforeEach(() => {
    adapter = new SearchApiAdapter({
      baseUrl: 'http://localhost:3000/api/search',
      apiKey: 'test-api-key'
    });
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(adapter.config).toEqual({
        baseUrl: 'http://localhost:3000/api/search',
        apiKey: 'test-api-key'
      });
    });
  });

  describe('search method', () => {
    it('should return expected search results structure', async () => {
      const searchParams = {
        query: 'test query',
        size: 10,
        from: 0
      };
      
      const result = await adapter.search(searchParams);
      
      expect(result).toHaveProperty('hits');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('took');
    });

    it('should handle different search parameters', async () => {
      const testParams = [
        { query: 'simple query', size: 5, from: 0 },
        { query: 'complex query with filters', size: 20, from: 10 },
        { query: '', size: 100, from: 0 },
        { query: 'query with special chars: + - && || ! ( ) { } [ ] ^ " ~ * ? : \\ /', size: 10, from: 0 }
      ];

      for (const params of testParams) {
        const result = await adapter.search(params);
        expect(result).toHaveProperty('hits');
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('took');
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
        'http://localhost:3000/api/search',
        { size: 10, from: 0 },
        'test query',
        { transport: 'http' },
        'searchapi'
      );
      
      // Mock the adapter search method to return consistent results
      const mockSearch = vi.spyOn(adapter, 'search');
      mockSearch.mockResolvedValue({
        hits: [
          { id: '1', title: 'Test Document 1', content: 'This is test content 1' },
          { id: '2', title: 'Test Document 2', content: 'This is test content 2' }
        ],
        total: 2,
        took: 5
      });
      
      const result = await searcher.search();
      
      expect(mockSearch).toHaveBeenCalledWith({
        query: 'test query',
        size: 10,
        from: 0
      });
      
      expect(result.docs).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
