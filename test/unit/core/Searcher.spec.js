import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Searcher } from '../../../core/Searcher.js';
import { EngineAdapter } from '../../../adapters/EngineAdapter.js';

// Mock adapter
class MockAdapter extends EngineAdapter {
  async search(params) {
    return {
      docs: [
        { id: 1, title: 'Test Document 1' },
        { id: 2, title: 'Test Document 2' }
      ],
      total: 2
    };
  }
}

describe('Searcher', () => {
  let searcher;
  let mockAdapter;
  
  beforeEach(() => {
    mockAdapter = new MockAdapter();
    searcher = new Searcher(
      mockAdapter,
      ['title', 'content'],
      'http://example.com/search',
      { rows: 10 },
      'test query',
      { transport: 'http' },
      'solr'
    );
  });

  describe('constructor', () => {
    it('should initialize properties correctly', () => {
      expect(searcher.adapter).toBe(mockAdapter);
      expect(searcher.fields).toEqual(['title', 'content']);
      expect(searcher.url).toBe('http://example.com/search');
      expect(searcher.params).toEqual({ rows: 10 });
      expect(searcher.queryText).toBe('test query');
      expect(searcher.config).toEqual({ transport: 'http' });
      expect(searcher.searchEngine).toBe('solr');
      expect(searcher.docs).toEqual([]);
      expect(searcher.total).toBe(0);
      expect(searcher.pageState).toBeNull();
    });

    it('should set transport on adapter if config.transport exists', () => {
      const adapter = new MockAdapter();
      const config = { transport: 'http' };
      const searcherWithTransport = new Searcher(
        adapter,
        [],
        '',
        {},
        '',
        config,
        ''
      );
      
      expect(adapter.transport).toBe('http');
    });

    it('should not set transport on adapter if config.transport does not exist', () => {
      const adapter = new MockAdapter();
      const config = {};
      const searcherWithTransport = new Searcher(
        adapter,
        [],
        '',
        {},
        '',
        config,
        ''
      );
      
      expect(adapter.transport).toBeUndefined();
    });

    it('should not set transport on adapter if config is null', () => {
      const adapter = new MockAdapter();
      const config = null;
      const searcherWithTransport = new Searcher(
        adapter,
        [],
        '',
        {},
        '',
        config,
        ''
      );
      
      expect(adapter.transport).toBeUndefined();
    });

    it('should not set transport on adapter if config is undefined', () => {
      const adapter = new MockAdapter();
      const config = undefined;
      const searcherWithTransport = new Searcher(
        adapter,
        [],
        '',
        {},
        '',
        config,
        ''
      );
      
      expect(adapter.transport).toBeUndefined();
    });
  });

  describe('search', () => {
    it('should perform search and update docs and total', async () => {
      const result = await searcher.search();
      
      expect(result.docs).toEqual([
        { id: 1, title: 'Test Document 1' },
        { id: 2, title: 'Test Document 2' }
      ]);
      expect(result.total).toBe(2);
      expect(searcher.docs).toEqual([
        { id: 1, title: 'Test Document 1' },
        { id: 2, title: 'Test Document 2' }
      ]);
      expect(searcher.total).toBe(2);
    });

    it('should pass correct search parameters to adapter', async () => {
      const searchSpy = vi.spyOn(mockAdapter, 'search');
      
      await searcher.search();
      
      expect(searchSpy).toHaveBeenCalledWith({
        rows: 10,
        q: 'test query'
      });
    });

    it('should handle search errors gracefully', async () => {
      const errorAdapter = new MockAdapter();
      errorAdapter.search = vi.fn().mockRejectedValue(new Error('Search failed'));
      
      const errorSearcher = new Searcher(
        errorAdapter,
        [],
        '',
        {},
        'test query',
        {},
        ''
      );
      
      await expect(errorSearcher.search()).rejects.toThrow('Search failed: Search failed');
    });
  });

  describe('pager', () => {
    it('should create a new searcher instance with same properties', () => {
      const newSearcher = searcher.pager();
      
      expect(newSearcher).toBeInstanceOf(Searcher);
      expect(newSearcher.adapter).toBe(searcher.adapter);
      expect(newSearcher.fields).toBe(searcher.fields);
      expect(newSearcher.url).toBe(searcher.url);
      expect(newSearcher.params).toBe(searcher.params);
      expect(newSearcher.queryText).toBe(searcher.queryText);
      expect(newSearcher.config).toBe(searcher.config);
      expect(newSearcher.searchEngine).toBe(searcher.searchEngine);
    });

    it('should copy pageState when it exists', () => {
      searcher.pageState = { page: 1, size: 10 };
      const newSearcher = searcher.pager();
      
      expect(newSearcher.pageState).toEqual({ page: 1, size: 10 });
      expect(newSearcher.pageState).not.toBe(searcher.pageState); // Should be a copy, not reference
    });

    it('should handle null pageState correctly', () => {
      searcher.pageState = null;
      const newSearcher = searcher.pager();
      
      expect(newSearcher.pageState).toBeNull();
    });
  });
});
