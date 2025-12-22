import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EsAdapter } from '../../../adapters/elasticsearch/EsAdapter.js';
import { Searcher } from '../../../core/Searcher.js';

describe('EsAdapter Integration', () => {
  let adapter;
  
  beforeEach(() => {
    adapter = new EsAdapter({
      host: 'http://localhost:9200',
      index: 'test_index'
    });
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(adapter.config).toEqual({
        host: 'http://localhost:9200',
        index: 'test_index'
      });
    });
  });

  describe('search method', () => {
    it('should return expected search results structure', async () => {
      const searchParams = {
        q: 'test query',
        size: 10,
        from: 0
      };
      
      const result = await adapter.search(searchParams);
      
      expect(result).toHaveProperty('hits');
      expect(result).toHaveProperty('timed_out');
      expect(result).toHaveProperty('took');
      expect(result.hits).toHaveProperty('hits');
      expect(result.hits).toHaveProperty('total');
    });

    it('should handle different search parameters', async () => {
      const testParams = [
        { q: 'simple query', size: 5, from: 0 },
        { q: 'complex query with filters', size: 20, from: 10 },
        { q: '', size: 100, from: 0 },
        { q: 'query with special chars: + - && || ! ( ) { } [ ] ^ " ~ * ? : \\ /', size: 10, from: 0 }
      ];

      for (const params of testParams) {
        const result = await adapter.search(params);
        expect(result).toHaveProperty('hits');
        expect(result).toHaveProperty('timed_out');
        expect(result).toHaveProperty('took');
      }
    });

    it('should maintain adapter state between searches', async () => {
      const firstResult = await adapter.search({ q: 'first query' });
      const secondResult = await adapter.search({ q: 'second query' });
      
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
        'http://localhost:9200/test_index/_search',
        { size: 10, from: 0 },
        'test query',
        { transport: 'http' },
        'elasticsearch'
      );
      
      // Mock the adapter search method to return consistent results
      const mockSearch = vi.spyOn(adapter, 'search');
      mockSearch.mockResolvedValue({
        hits: {
          hits: [
            { _id: '1', _source: { id: 1, title: 'Test Document 1', content: 'This is test content 1' } },
            { _id: '2', _source: { id: 2, title: 'Test Document 2', content: 'This is test content 2' } }
          ],
          total: 2
        },
        timed_out: false,
        took: 5
      });
      
      const result = await searcher.search();
      
      expect(mockSearch).toHaveBeenCalledWith({
        q: 'test query',
        size: 10,
        from: 0
      });
      
      expect(result.docs).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
