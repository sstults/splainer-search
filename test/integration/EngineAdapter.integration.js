import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EngineAdapter } from '../../adapters/EngineAdapter.js';
import { Searcher } from '../../core/Searcher.js';

describe('EngineAdapter Integration', () => {
  let engineAdapter;
  
  beforeEach(() => {
    // Create a mock engine adapter that extends EngineAdapter
    class MockEngineAdapter extends EngineAdapter {
      constructor(config) {
        super(config);
      }
      
      async search(params) {
        // Mock implementation that returns structured results
        return {
          hits: [
            { _id: '1', _source: { id: 1, title: 'Test Document 1', content: 'This is test content 1' } },
            { _id: '2', _source: { id: 2, title: 'Test Document 2', content: 'This is test content 2' } }
          ],
          total: 2,
          took: 5,
          timed_out: false
        };
      }
      
      // Override to return specific engine type
      getEngineType() {
        return 'mock-engine';
      }
    }
    
    engineAdapter = new MockEngineAdapter({
      host: 'http://localhost:9200',
      index: 'test_index'
    });
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(engineAdapter.config).toEqual({
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
      
      const result = await engineAdapter.search(searchParams);
      
      expect(result).toHaveProperty('hits');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('took');
      expect(result).toHaveProperty('timed_out');
    });

    it('should handle different search parameters', async () => {
      const testParams = [
        { q: 'simple query', size: 5, from: 0 },
        { q: 'complex query with filters', size: 20, from: 10 },
        { q: '', size: 100, from: 0 }
      ];

      for (const params of testParams) {
        const result = await engineAdapter.search(params);
        expect(result).toHaveProperty('hits');
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('took');
        expect(result).toHaveProperty('timed_out');
      }
    });

    it('should maintain adapter state between searches', async () => {
      const firstResult = await engineAdapter.search({ q: 'first query' });
      const secondResult = await engineAdapter.search({ q: 'second query' });
      
      // Both should return valid results
      expect(firstResult).toHaveProperty('hits');
      expect(secondResult).toHaveProperty('hits');
    });
  });

  describe('integration with Searcher', () => {
    it('should work correctly with Searcher class', async () => {
      const searcher = new Searcher(
        engineAdapter,
        ['title', 'content'],
        'http://localhost:9200/test_index/_search',
        { size: 10, from: 0 },
        'test query',
        { transport: 'http' },
        'mock-engine'
      );
      
      const result = await searcher.search();
      
      expect(result.docs).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.engine).toBe('mock-engine');
    });
  });

  describe('engine type detection', () => {
    it('should correctly identify engine type', async () => {
      const engineType = engineAdapter.getEngineType();
      expect(engineType).toBe('mock-engine');
    });
  });
});
