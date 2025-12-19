import { describe, it, expect, vi } from 'vitest';
import { SearchApiAdapter } from '../../../../adapters/searchApi/SearchApiAdapter.js';

// Mock transport service
const mockTransport = {
  get: vi.fn()
};

describe('SearchApiAdapter', () => {
  it('should instantiate correctly', () => {
    const adapter = new SearchApiAdapter({ url: 'http://api.example.com' });
    expect(adapter).toBeInstanceOf(SearchApiAdapter);
    expect(adapter.config).toEqual({ url: 'http://api.example.com' });
  });

  it('should inherit from EngineAdapter', () => {
    const adapter = new SearchApiAdapter();
    expect(adapter).toBeInstanceOf(SearchApiAdapter);
    expect(adapter).toBeInstanceOf(SearchApiAdapter);
  });

  it('should have search method', () => {
    const adapter = new SearchApiAdapter();
    expect(adapter.search).toBeInstanceOf(Function);
  });

  it('should have getDoc method', () => {
    const adapter = new SearchApiAdapter();
    expect(adapter.getDoc).toBeInstanceOf(Function);
  });

  it('should handle search with parameters', () => {
    const adapter = new SearchApiAdapter({ url: 'http://api.example.com', rows: 20 });
    adapter.transport = mockTransport;
    
    const result = adapter.search('test query', { filter: 'category:books' });
    
    expect(mockTransport.get).toHaveBeenCalledWith(
      'http://api.example.com/search',
      {
        query: 'test query',
        filter: 'category:books',
        size: 20
      }
    );
  });

  it('should handle getDoc with id', () => {
    const adapter = new SearchApiAdapter({ url: 'http://api.example.com' });
    adapter.transport = mockTransport;
    
    const result = adapter.getDoc('doc123');
    
    expect(mockTransport.get).toHaveBeenCalledWith(
      'http://api.example.com/documents/doc123'
    );
  });
});
