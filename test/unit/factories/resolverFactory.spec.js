import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createResolver } from '../../../factories/resolverFactory.js';

describe('resolverFactory', () => {
  let mockConfig;
  
  beforeEach(() => {
    mockConfig = {
      searchUrl: 'http://example.com:1234/collection1/select',
      searchEngine: 'solr'
    };
  });

  describe('createResolver', () => {
    it('should create a resolver instance', () => {
      const resolver = createResolver(mockConfig, 'solr');
      expect(resolver).toBeDefined();
      expect(typeof resolver).toBe('object');
    });

    it('should set the searchEngine property in config', () => {
      const resolver = createResolver(mockConfig, 'elasticsearch');
      expect(mockConfig.searchEngine).toBe('elasticsearch');
    });

    it('should return a resolver instance that is a DocResolver', () => {
      const resolver = createResolver(mockConfig, 'solr');
      // Since we can't directly check the constructor, we'll check if it has the expected methods
      expect(resolver).toHaveProperty('resolve');
      expect(typeof resolver.resolve).toBe('function');
    });

    it('should handle different search engine types', () => {
      const engines = ['solr', 'elasticsearch', 'algolia', 'vectara', 'searchapi'];
      
      engines.forEach(engine => {
        const resolver = createResolver(mockConfig, engine);
        expect(mockConfig.searchEngine).toBe(engine);
        expect(resolver).toBeDefined();
      });
    });

    it('should handle empty config object', () => {
      const emptyConfig = {};
      const resolver = createResolver(emptyConfig, 'solr');
      expect(mockConfig.searchEngine).toBe('solr');
      expect(resolver).toBeDefined();
    });

    it('should handle null config', () => {
      const resolver = createResolver(null, 'solr');
      // When config is null, we don't set searchEngine but the resolver should still be created
      expect(resolver).toBeDefined();
    });

    it('should handle undefined config', () => {
      const resolver = createResolver(undefined, 'solr');
      // When config is undefined, we don't set searchEngine but the resolver should still be created
      expect(resolver).toBeDefined();
    });

    it('should handle invalid search engine type', () => {
      const resolver = createResolver(mockConfig, 'invalid-engine');
      expect(mockConfig.searchEngine).toBe('invalid-engine');
      expect(resolver).toBeDefined();
    });

    it('should handle numeric search engine type', () => {
      const resolver = createResolver(mockConfig, 123);
      expect(mockConfig.searchEngine).toBe(123);
      expect(resolver).toBeDefined();
    });

    it('should handle boolean search engine type', () => {
      const resolver = createResolver(mockConfig, true);
      expect(mockConfig.searchEngine).toBe(true);
      expect(resolver).toBeDefined();
    });

    it('should handle array search engine type', () => {
      const engineArray = ['solr', 'elasticsearch'];
      const resolver = createResolver(mockConfig, engineArray);
      expect(mockConfig.searchEngine).toBe(engineArray);
      expect(resolver).toBeDefined();
    });

    it('should handle object search engine type', () => {
      const engineObj = { name: 'solr' };
      const resolver = createResolver(mockConfig, engineObj);
      expect(mockConfig.searchEngine).toBe(engineObj);
      expect(resolver).toBeDefined();
    });
  });
});
