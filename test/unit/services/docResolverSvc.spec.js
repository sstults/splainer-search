import DocResolver from '../../../services/docResolverSvc.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DocResolver', function () {
  let docResolver;
  let mockConfig;
  
  beforeEach(() => {
    mockConfig = {
      searchUrl: 'http://example.com:1234/collection1/select'
    };
    
    docResolver = new DocResolver(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize with config', () => {
      expect(docResolver.config).toBe(mockConfig);
    });
  });

  describe('resolve method', () => {
    it('should return a promise', () => {
      const result = docResolver.resolve();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to an empty array by default', async () => {
      const result = await docResolver.resolve();
      expect(result).toEqual([]);
    });
  });
});
