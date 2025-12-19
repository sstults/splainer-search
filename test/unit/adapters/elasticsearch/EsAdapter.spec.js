import { describe, it, expect } from 'vitest';
import { EsAdapter } from '../../../../adapters/elasticsearch/EsAdapter.js';

describe('EsAdapter', () => {
  it('should instantiate correctly', () => {
    const adapter = new EsAdapter({ host: 'localhost', port: 9200 });
    expect(adapter).toBeInstanceOf(EsAdapter);
    expect(adapter.config).toEqual({ host: 'localhost', port: 9200 });
  });

  it('should inherit from EngineAdapter', () => {
    const adapter = new EsAdapter();
    expect(adapter).toBeInstanceOf(EsAdapter);
    expect(adapter).toBeInstanceOf(EsAdapter);
  });

  it('should have search method', () => {
    const adapter = new EsAdapter();
    expect(adapter.search).toBeInstanceOf(Function);
  });

  it('should handle search with parameters', async () => {
    const adapter = new EsAdapter();
    const result = await adapter.search({ query: 'test' });
    expect(result).toEqual({
      hits: {
        hits: [],
        total: 0
      },
      timed_out: false,
      took: 0
    });
  });
});
