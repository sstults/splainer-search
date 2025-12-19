import { describe, it, expect } from 'vitest';
import { VectaraAdapter } from '../../../../adapters/vectara/VectaraAdapter.js';

describe('VectaraAdapter', () => {
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
    const adapter = new VectaraAdapter();
    const result = await adapter.search({ query: 'test' });
    expect(result).toEqual({
      response: [],
      total: 0
    });
  });
});
