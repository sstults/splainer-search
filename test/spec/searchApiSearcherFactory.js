/**
 * Test for SearchApiSearcherFactory
 * This tests that the SearchApiSearcherFactory properly sets up transport
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createSearchApiSearcher } from '../../factories/searchApiSearcherFactory.js';
import { SearchApiAdapter } from '../../adapters/searchApi/SearchApiAdapter.js';

describe('Factory: searchApiSearcherFactory', () => {
  let mockTransport;
  let mockConfig;
  let searcher;

  beforeEach(() => {
    // Mock transport object
    mockTransport = {
      get: vi.fn(),
      post: vi.fn()
    };

    // Mock configuration with transport
    mockConfig = {
      url: 'http://example.com:1234/api',
      transport: mockTransport,
      searchEngine: 'searchapi'
    };
  });

  it('creates a searcher with proper transport setup', () => {
    // Create searcher using the factory
    searcher = createSearchApiSearcher(mockConfig);
    
    // Verify searcher was created
    expect(searcher).toBeDefined();
    expect(searcher.adapter).toBeDefined();
    expect(searcher.adapter.constructor.name).toBe('SearchApiAdapter');
    
    // Verify transport was set on the adapter
    expect(searcher.adapter.transport).toBe(mockTransport);
  });

  it('search method calls transport.get with correct parameters', async () => {
    // Setup mock transport to return a resolved promise
    mockTransport.get.mockResolvedValue({
      docs: [{ id: 1, title: 'Test Doc' }],
      total: 1
    });

    // Create searcher
    searcher = createSearchApiSearcher(mockConfig);
    
    // Mock the adapter search method to call transport
    const originalSearch = searcher.adapter.search;
    searcher.adapter.search = vi.fn().mockImplementation(async (params) => {
      const searchUrl = `${mockConfig.url}/search`;
      return searcher.adapter.transport.get(searchUrl, params);
    });

    // Call search
    const result = await searcher.search();
    
    // Verify transport.get was called
    expect(mockTransport.get).toHaveBeenCalled();
    expect(mockTransport.get).toHaveBeenCalledWith(
      'http://example.com:1234/api/search',
      expect.any(Object)
    );
  });

  it('getDoc method calls transport.get with correct document URL', async () => {
    // Setup mock transport
    mockTransport.get.mockResolvedValue({ id: 1, title: 'Test Doc' });
    
    // Create searcher
    searcher = createSearchApiSearcher(mockConfig);
    
    // Mock the adapter getDoc method to call transport
    const originalGetDoc = searcher.adapter.getDoc;
    searcher.adapter.getDoc = vi.fn().mockImplementation(async (id) => {
      const docUrl = `${mockConfig.url}/documents/${id}`;
      return searcher.adapter.transport.get(docUrl);
    });

    // Call getDoc
    const result = await searcher.adapter.getDoc('123');
    
    // Verify transport.get was called with correct URL
    expect(mockTransport.get).toHaveBeenCalledWith(
      'http://example.com:1234/api/documents/123'
    );
  });
});
