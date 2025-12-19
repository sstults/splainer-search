import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VectaraAdapter } from '../../../adapters/vectara/VectaraAdapter.js';
import { Searcher } from '../../../core/Searcher.js';

describe('VectaraAdapter Integration', () => {
  let adapter;
  
  beforeEach(() => {
    adapter = new VectaraAdapter({
      customerId: 'test-customer-id',
      corpusId: 'test-corpus-id',
      apiKey: 'test-api-key'
    });
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(adapter.config).toEqual({
        customerId: 'test-customer-id',
        corpusId: 'test-corpus-id',
        apiKey: 'test-api-key'
      });
    });
  });

  describe('search method', () => {
    it('should return expected search results structure', async () => {
      const searchParams = {
        query: 'test query',
        numResults: 10,
        start: 0
      };
      
      const result = await adapter.search(searchParams);
      
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('took');
    });

    it('should handle different search parameters', async () => {
      const testParams = [
        { query: 'simple query', numResults: 5, start: 0 },
        { query: 'complex query with filters', numResults: 20, start: 10 },
        { query: '', numResults: 100, start: 0 },
        { query: 'query with special chars: + - && || ! ( ) { } [ ] ^ " ~ * ? : \\ /', numResults: 10, start: 0 }
      ];

      for (const params of testParams) {
        const result = await adapter.search(params);
        expect(result).toHaveProperty('results');
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('took');
      }
    });

    it('should maintain adapter state between searches', async () => {
      const firstResult = await adapter.search({ query: 'first query' });
      const secondResult = await adapter.search({ query: 'second query' });
      
      // Both should return valid results
      expect(firstResult).toHaveProperty('results');
      expect(secondResult).toHaveProperty('results');
    });
  });

  describe('integration with Searcher', () => {
    it('should work correctly with Searcher class', async () => {
      const searcher = new Searcher(
        adapter,
        ['title', 'content'],
        'https://api.vectara.io/v1/query',
        { numResults: 10, start: 0 },
        'test query',
        { transport: 'http' },
        'vectara'
      );
      
      // Mock the adapter search method to return consistent results
      const mockSearch = vi.spyOn(adapter, 'search');
      mockSearch.mockResolvedValue({
        results: [
          { id: '1', title: 'Test Document 1', content: 'This is test content 1' },
          { id: '2', title: 'Test Document 2', content: 'This is test content 2' }
        ],
        total: 2,
        took: 5
      });
      
      const result = await searcher.search();
      
      expect(mockSearch).toHaveBeenCalledWith({
        query: 'test query',
        numResults: 10,
        start: 0
      });
      
      expect(result.docs).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
