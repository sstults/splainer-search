'use strict';

import { describe, expect, it } from 'vitest';
import DocResolver from '../../src/services/docResolverSvc.js';

// Legacy Angular docResolverSvc behavior was removed when the resolver moved to a
// lightweight class-based API. These tests cover the current resolve contract.

describe('Service: DocResolver', () => {
  it('returns an empty array by default', async () => {
    const resolver = new DocResolver({});
    await expect(resolver.resolve()).resolves.toEqual([]);
  });

  it('stores the provided config', () => {
    const config = { endpoint: 'http://example.com' };
    const resolver = new DocResolver(config);
    expect(resolver.config).toBe(config);
  });
});
