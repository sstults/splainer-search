import { describe, it, expect } from 'vitest';
import { EngineAdapter } from '../../adapters/EngineAdapter.js';

describe('EngineAdapter', () => {
  it('should throw when instantiated directly', () => {
    expect(() => {
      new EngineAdapter();
    }).toThrow('EngineAdapter is abstract and cannot be instantiated directly');
  });

  it('should require search method to be implemented', () => {
    const adapter = new (class extends EngineAdapter {
      // Empty implementation
    })();
    expect(() => {
      adapter.search();
    }).toThrow('Search method must be implemented by concrete adapter');
  });
});
