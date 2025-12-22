import { describe, it, expect, vi } from 'vitest';
import { VectaraAdapter } from '../../../../adapters/vectara/VectaraAdapter.js';

describe('VectaraAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should instantiate correctly', () => {
    const adapter = new VectaraAdapter({ customerId: '12345' });
    expect(adapter).toBeInstanceOf(VectaraAdapter);
    expect(adapter.config).toEqual({ customerId: '12345' });
  });

  it('should inherit from EngineAdapter', () => {
    const adapter = new VectaraAdapter();
    expect(adapter).toBeInstanceOf(VectaraAdapter);
    expect(adapter).toBeInstanceOf(VectaraAdapter);
  });

  it('should have search method', () => {
    const adapter = new VectaraAdapter();
    expect(adapter.search).toBeInstanceOf(Function);
  });

  it('should handle search with parameters', async () => {
    // Mock successful response
    const mockResponse = {
      response: [{ id: '1', title: 'Test Result' }],
      total: 1,
      took: 100
    };

    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const adapter = new VectaraAdapter({
      customerId: '12345',
      corpusId: '67890',
      apiKey: 'test-api-key'
    });

    const result = await adapter.search({ q: 'test' });
    
    expect(result).toEqual({
      docs: [{ id: '1', title: 'Test Result' }],
      total: 1,
      took: 100
    });
    
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.vectara.io/v1/query',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key'
        }
      })
    );
  });

  it('should handle search with default parameters', async () => {
    const mockResponse = {
      response: [],
      total: 0,
      took: 0
    };

    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const adapter = new VectaraAdapter({
      customerId: '12345',
      corpusId: '67890',
      apiKey: 'test-api-key'
    });

    const result = await adapter.search({ q: 'test' });
    
    expect(result).toEqual({
      docs: [],
      total: 0,
      took: 0
    });
  });

  it('should handle API errors', async () => {
    // Mock error response
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ error: 'Internal server error' })
    });

    const adapter = new VectaraAdapter({
      customerId: '12345',
      corpusId: '67890',
      apiKey: 'test-api-key'
    });

    try {
      await adapter.search({ q: 'test' });
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toContain('Vectara API error');
    }
  });
});
