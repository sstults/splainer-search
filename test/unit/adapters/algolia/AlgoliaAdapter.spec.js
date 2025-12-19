import { describe, it, expect } from 'vitest';
import { AlgoliaAdapter } from '../../../../adapters/algolia/AlgoliaAdapter.js';

describe('AlgoliaAdapter', () => {
  it('should instantiate correctly', () => {
    const adapter = new AlgoliaAdapter({ appId: 'test-app', apiKey: 'test-key' });
    expect(adapter).toBeInstanceOf(AlgoliaAdapter);
    expect(adapter.config).toEqual({ appId: 'test-app', apiKey: 'test-key' });
  });

  it('should have search method', () => {
    const adapter = new AlgoliaAdapter();
    expect(adapter.search).toBeInstanceOf(Function);
  });

  it('should handle search with parameters', async () => {
    const adapter = new AlgoliaAdapter();
    const result = await adapter.search({ query: 'test' });
    expect(result).toEqual({
      hits: [],
      nbHits: 0,
      processingTimeMS: 0
    });
  });
});
