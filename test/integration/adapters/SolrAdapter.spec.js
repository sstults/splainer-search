import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SolrAdapter } from '../../../adapters/solr/SolrAdapter.js';
import { Searcher } from '../../../core/Searcher.js';

describe('SolrAdapter Integration', () => {
  let adapter;
  
  beforeEach(() => {
    adapter = new SolrAdapter({
      host: 'http://localhost:8983',
      core: 'test_core'
    });
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(adapter.config).toEqual({
        host: 'http://localhost:8983',
        core: 'test_core'
      });
    });
  });

  describe('search method', () => {
    it('should return expected search results structure', async () => {
      const searchParams = {
        q: 'test query',
        rows: 10,
        start: 0
      };
      
      const result = await adapter.search(searchParams);
      
      expect(result).toHaveProperty('docs');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('responseHeader');
      expect(result.responseHeader).toHaveProperty('status');
      expect(result.responseHeader).toHaveProperty('QTime');
    });

    it('should handle different search parameters', async () => {
      const testParams = [
        { q: 'simple query', rows: 5, start: 0 },
        { q: 'complex query with filters', rows: 20, start: 10 },
        { q: '', rows: 100, start: 0 },
        { q: 'query with special chars: + - && || ! ( ) { } [ ] ^ " ~ * ? : \\ /', rows: 10, start: 0 }
      ];

      for (const params of testParams) {
        const result = await adapter.search(params);
        expect(result).toHaveProperty('docs');
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('responseHeader');
      }
    });

    it('should maintain adapter state between searches', async () => {
      const firstResult = await adapter.search({ q: 'first query' });
      const secondResult = await adapter.search({ q: 'second query' });
      
      // Both should return valid results
      expect(firstResult).toHaveProperty('docs');
      expect(secondResult).toHaveProperty('docs');
    });
  });

  describe('integration with Searcher', () => {
    it('should work correctly with Searcher class', async () => {
      const searcher = new Searcher(
        adapter,
        ['title', 'content'],
        'http://localhost:8983/solr/test_core/select',
        { rows: 10, start: 0 },
        'test query',
        { transport: 'http' },
        'solr'
      );
      
      // Mock the adapter search method to return consistent results
      const mockSearch = vi.spyOn(adapter, 'search');
      mockSearch.mockResolvedValue({
        docs: [
          { id: 1, title: 'Test Document 1', content: 'This is test content 1' },
          { id: 2, title: 'Test Document 2', content: 'This is test content 2' }
        ],
        total: 2,
        responseHeader: {
          status: 0,
          QTime: 5
        }
      });
      
      const result = await searcher.search();
      
      expect(mockSearch).toHaveBeenCalledWith({
        q: 'test query',
        rows: 10,
        start: 0
      });
      
      expect(result.docs).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
