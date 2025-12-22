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
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          response: [{ id: '1', title: 'Test Result' }],
          total: 1,
          took: 100
        })
      };

      // Mock fetch for this specific test
      const mockFetch = vi.fn();
      vi.stubGlobal('fetch', mockFetch);
      mockFetch.mockResolvedValueOnce(mockResponse);

      const searchParams = {
        q: 'test query',
        numResults: 10,
        start: 0
      };
      
      const result = await adapter.search(searchParams);
      
      expect(result).toHaveProperty('docs');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('took');
    });

    it('should handle different search parameters', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          response: [],
          total: 0,
          took: 0
        })
      };

      // Mock fetch for this specific test
      const mockFetch = vi.fn();
      vi.stubGlobal('fetch', mockFetch);
      mockFetch.mockResolvedValueOnce(mockResponse);

      const testParams = [
        { q: 'simple query', numResults: 5, start: 0 },
        { q: 'complex query with filters', numResults: 20, start: 10 },
        { q: '', numResults: 100, start: 0 },
        { q: 'query with special chars: + - && || ! ( ) { } [ ] ^ " ~ * ? : \\ /', numResults: 10, start: 0 }
      ];

      for (const params of testParams) {
        // Create fresh mock for each iteration
        const mockFetch = vi.fn();
        vi.stubGlobal('fetch', mockFetch);
        mockFetch.mockResolvedValueOnce(mockResponse);
        
        const result = await adapter.search(params);
        expect(result).toHaveProperty('docs');
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('took');
      }
    });

    it('should maintain adapter state between searches', async () => {
      // Mock successful response for first call
      const mockResponse1 = {
        ok: true,
        json: () => Promise.resolve({
          response: [{ id: '1', title: 'First Result' }],
          total: 1,
          took: 50
        })
      };

      // Mock successful response for second call
      const mockResponse2 = {
        ok: true,
        json: () => Promise.resolve({
          response: [{ id: '2', title: 'Second Result' }],
          total: 1,
          took: 60
        })
      };

      // Mock fetch for first call
      const mockFetch1 = vi.fn();
      vi.stubGlobal('fetch', mockFetch1);
      mockFetch1.mockResolvedValueOnce(mockResponse1);

      const firstResult = await adapter.search({ q: 'first query' });
      
      // Mock fetch for second call
      const mockFetch2 = vi.fn();
      vi.stubGlobal('fetch', mockFetch2);
      mockFetch2.mockResolvedValueOnce(mockResponse2);

      const secondResult = await adapter.search({ q: 'second query' });
      
      // Both should return valid results
      expect(firstResult).toHaveProperty('docs');
      expect(secondResult).toHaveProperty('docs');
    });

    it('should handle API errors', async () => {
      // Mock error response
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'Internal server error' })
      };

      // Mock fetch for this specific test
      const mockFetch = vi.fn();
      vi.stubGlobal('fetch', mockFetch);
      mockFetch.mockResolvedValueOnce(mockResponse);

      try {
        await adapter.search({ q: 'test' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('Vectara API error');
      }
    });
  });

  describe('integration with Searcher', () => {
    it('should work correctly with Searcher class', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          response: [
            { id: '1', title: 'Test Document 1', content: 'This is test content 1' },
            { id: '2', title: 'Test Document 2', content: 'This is test content 2' }
          ],
          total: 2,
          took: 5
        })
      };

      // Mock fetch for this specific test
      const mockFetch = vi.fn();
      vi.stubGlobal('fetch', mockFetch);
      mockFetch.mockResolvedValueOnce(mockResponse);

      const searcher = new Searcher(
        adapter,
        ['title', 'content'],
        'https://api.vectara.io/v1/query',
        { numResults: 10, start: 0 },
        'test query',
        { transport: 'http' },
        'vectara'
      );
      
      const result = await searcher.search();
      
      expect(result.docs).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
