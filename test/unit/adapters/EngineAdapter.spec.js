import { describe, it, expect } from 'vitest';
import { EngineAdapter } from '../../../adapters/EngineAdapter.js';

describe('EngineAdapter', () => {
  it('should throw when instantiated directly', () => {
    expect(() => {
      new EngineAdapter();
    }).toThrow('EngineAdapter is abstract and cannot be instantiated directly');
  });

  it('should have search method signature', () => {
    const adapter = new (class extends EngineAdapter {
      async search() {
        return { docs: [], total: 0 };
      }
    })();
    expect(adapter.search).toBeInstanceOf(Function);
  });

  it('should throw when search method is called on abstract class', async () => {
    const adapter = new (class extends EngineAdapter {
      // Don't override search method to test abstract behavior
    })();
    
    await expect(adapter.search({ query: 'test' })).rejects.toThrow(
      'Search method must be implemented by concrete adapter'
    );
  });
});
