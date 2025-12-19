import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Searcher } from '../../../core/Searcher.js';
import { EngineAdapter } from '../../../adapters/EngineAdapter.js';

// Mock adapter that simulates real search engine behavior
class MockEngineAdapter extends EngineAdapter {
  constructor() {
    super();
    this.searchCount = 0;
  }

  async search(searchParams) {
    this.searchCount++;
    
    // Simulate different response types based on parameters
    if (searchParams.q === 'error') {
      throw new Error('Search failed');
    }
    
    // Mock search results
    const mockResults = {
      hits: {
        hits: [
          { _id: '1', _source: { id: 1, title: 'Test Document 1', content: 'This is test content 1' } },
          { _id: '2', _source: { id: 2, title: 'Test Document 2', content: 'This is test content 2' } }
        ],
        total: 2
      },
      timed_out: false,
      took: 5
    };
    
    return mockResults;
  }
}

describe('Searcher Integration', () => {
  let searcher;
  let mockAdapter;
  
  beforeEach(() => {
    mockAdapter = new MockEngineAdapter();
    searcher = new Searcher(
      mockAdapter,
      ['title', 'content'],
      'http://example.com/search',
      { rows: 10, start: 0 },
      'test query',
      { transport: 'http' },
      'solr'
    );
  });

  afterEach(() => {
    // Reset mock adapter state
    mockAdapter.searchCount = 0;
  });

  describe('constructor', () => {
    it('should initialize with correct properties', () => {
      expect(searcher.adapter).toBe(mockAdapter);
      expect(searcher.fields).toEqual(['title', 'content']);
      expect(searcher.url).toBe('http://example.com/search');
      expect(searcher.params).toEqual({ rows: 10, start: 0 });
      expect(searcher.queryText).toBe('test query');
      expect(searcher.config).toEqual({ transport: 'http' });
      expect(searcher.searchEngine).toBe('solr');
      expect(searcher.docs).toEqual([]);
      expect(searcher.total).toBe(0);
      expect(searcher.pageState).toBeNull();
    });
  });

  describe('search method', () => {
    it('should perform search and update docs and total correctly', async () => {
      const result = await searcher.search();
      
      expect(result.docs).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(searcher.docs).toHaveLength(2);
      expect(searcher.total).toBe(2);
      expect(mockAdapter.searchCount).toBe(1);
    });

    it('should pass correct search parameters to adapter', async () => {
      const searchSpy = vi.spyOn(mockAdapter, 'search');
      
      await searcher.search();
      
      expect(searchSpy).toHaveBeenCalledWith({
        rows: 10,
        start: 0,
        q: 'test query'
      });
    });

    it('should handle search errors gracefully', async () => {
      const errorAdapter = new MockEngineAdapter();
      errorAdapter.search = vi.fn().mockRejectedValue(new Error('Search failed'));
      
      const errorSearcher = new Searcher(
        errorAdapter,
        [],
        '',
        {},
        'error',
        {},
        ''
      );
      
      await expect(errorSearcher.search()).rejects.toThrow('Search failed: Search failed');
    });

    it('should handle empty search results', async () => {
      const emptyAdapter = new MockEngineAdapter();
      emptyAdapter.search = vi.fn().mockResolvedValue({
        hits: {
          hits: [],
          total: 0
        },
        timed_out: false,
        took: 0
      });
      
      const emptySearcher = new Searcher(
        emptyAdapter,
        [],
        '',
        {},
        'empty query',
        {},
        ''
      );
      
      const result = await emptySearcher.search();
      
      expect(result.docs).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(emptySearcher.docs).toHaveLength(0);
      expect(emptySearcher.total).toBe(0);
    });
  });

  describe('pagination', () => {
    it('should handle pagination correctly', async () => {
      const result = await searcher.search();
      
      // Test that pagination works by creating a new searcher with page state
      const newSearcher = searcher.pager();
      
      expect(newSearcher).toBeInstanceOf(Searcher);
      expect(newSearcher.adapter).toBe(searcher.adapter);
      expect(newSearcher.fields).toBe(searcher.fields);
      expect(newSearcher.url).toBe(searcher.url);
      expect(newSearcher.params).toBe(searcher.params);
      expect(newSearcher.queryText).toBe(searcher.queryText);
      expect(newSearcher.config).toBe(searcher.config);
      expect(newSearcher.searchEngine).toBe(searcher.searchEngine);
      expect(newSearcher.pageState).toBeNull();
    });

    it('should copy pageState correctly', () => {
      searcher.pageState = { page: 1, size: 10 };
      const newSearcher = searcher.pager();
      
      expect(newSearcher.pageState).toEqual({ page: 1, size: 10 });
      expect(newSearcher.pageState).not.toBe(searcher.pageState); // Should be a copy, not reference
    });
  });

  describe('search parameter handling', () => {
    it('should handle different search parameter combinations', async () => {
      // Test with various parameter configurations
      const testConfigs = [
        { rows: 5, start: 0 },
        { rows: 20, start: 10 },
        { rows: 100, start: 0 },
        { rows: 10, start: 50 }
      ];

      for (const params of testConfigs) {
        const testSearcher = new Searcher(
          mockAdapter,
          ['title'],
          'http://example.com/search',
          params,
          'test query',
          {},
          'solr'
        );
        
        await testSearcher.search();
        expect(mockAdapter.searchCount).toBeGreaterThan(0);
      }
    });
  });
});
