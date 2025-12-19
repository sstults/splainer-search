import { describe, it, expect, beforeEach } from 'vitest';
import { createDoc } from '../../../factories/docFactory.js';

describe('docFactory', () => {
  let mockSource;
  let mockHighlight;
  let mockSearchEngine;

  beforeEach(() => {
    mockSource = {
      id: '123',
      title: 'Test Document',
      content: 'This is a test document content'
    };
    
    mockHighlight = {
      '123': {
        title: ['<em>Test</em> Document'],
        content: ['This is a <em>test</em> document content']
      }
    };
    
    mockSearchEngine = 'solr';
  });

  describe('createDoc', () => {
    it('should create a doc instance with source, highlight, and searchEngine', () => {
      const doc = createDoc(mockSource, mockHighlight, mockSearchEngine);
      
      expect(doc).toBeDefined();
      expect(typeof doc).toBe('object');
      expect(doc).toHaveProperty('_source');
      expect(doc).toHaveProperty('_highlight');
      expect(doc).toHaveProperty('_explain');
    });

    it('should properly initialize doc with source data', () => {
      const doc = createDoc(mockSource, mockHighlight, mockSearchEngine);
      
      expect(doc._source).toEqual(mockSource);
    });

    it('should properly initialize doc with highlight data', () => {
      const doc = createDoc(mockSource, mockHighlight, mockSearchEngine);
      
      expect(doc._highlight).toEqual(mockHighlight);
    });

    it('should initialize explain as null when not provided', () => {
      const doc = createDoc(mockSource, mockHighlight, mockSearchEngine);
      
      expect(doc._explain).toBeNull();
    });

    it('should handle empty source object', () => {
      const emptySource = {};
      const doc = createDoc(emptySource, mockHighlight, mockSearchEngine);
      
      expect(doc._source).toEqual(emptySource);
    });

    it('should handle null source', () => {
      const doc = createDoc(null, mockHighlight, mockSearchEngine);
      
      expect(doc._source).toEqual({});
    });

    it('should handle undefined source', () => {
      const doc = createDoc(undefined, mockHighlight, mockSearchEngine);
      
      expect(doc._source).toEqual({});
    });

    it('should handle empty highlight object', () => {
      const emptyHighlight = {};
      const doc = createDoc(mockSource, emptyHighlight, mockSearchEngine);
      
      expect(doc._highlight).toEqual(emptyHighlight);
    });

    it('should handle null highlight', () => {
      const doc = createDoc(mockSource, null, mockSearchEngine);
      
      expect(doc._highlight).toEqual({});
    });

    it('should handle undefined highlight', () => {
      const doc = createDoc(mockSource, undefined, mockSearchEngine);
      
      expect(doc._highlight).toEqual({});
    });

    it('should handle different search engine types', () => {
      const engines = ['solr', 'elasticsearch', 'algolia', 'vectara', 'searchapi'];
      
      engines.forEach(engine => {
        const doc = createDoc(mockSource, mockHighlight, engine);
        expect(doc).toBeDefined();
        expect(doc._source).toEqual(mockSource);
        expect(doc._highlight).toEqual(mockHighlight);
      });
    });

    it('should handle numeric search engine type', () => {
      const doc = createDoc(mockSource, mockHighlight, 123);
      expect(doc).toBeDefined();
      expect(doc._source).toEqual(mockSource);
      expect(doc._highlight).toEqual(mockHighlight);
    });

    it('should handle boolean search engine type', () => {
      const doc = createDoc(mockSource, mockHighlight, true);
      expect(doc).toBeDefined();
      expect(doc._source).toEqual(mockSource);
      expect(doc._highlight).toEqual(mockHighlight);
    });

    it('should handle array search engine type', () => {
      const engineArray = ['solr', 'elasticsearch'];
      const doc = createDoc(mockSource, mockHighlight, engineArray);
      expect(doc).toBeDefined();
      expect(doc._source).toEqual(mockSource);
      expect(doc._highlight).toEqual(mockHighlight);
    });

    it('should handle object search engine type', () => {
      const engineObj = { name: 'solr' };
      const doc = createDoc(mockSource, mockHighlight, engineObj);
      expect(doc).toBeDefined();
      expect(doc._source).toEqual(mockSource);
      expect(doc._highlight).toEqual(mockHighlight);
    });

    it('should handle empty source and highlight', () => {
      const doc = createDoc({}, {}, mockSearchEngine);
      expect(doc._source).toEqual({});
      expect(doc._highlight).toEqual({});
    });

    it('should handle complex source data', () => {
      const complexSource = {
        id: '456',
        title: 'Complex Document',
        content: 'This has multiple fields',
        nested: {
          field: 'value',
          array: [1, 2, 3]
        },
        metadata: {
          author: 'John Doe',
          date: '2023-01-01'
        }
      };
      
      const doc = createDoc(complexSource, mockHighlight, mockSearchEngine);
      expect(doc._source).toEqual(complexSource);
    });

    it('should handle complex highlight data', () => {
      const complexHighlight = {
        '456': {
          title: ['<em>Complex</em> Document'],
          content: ['This has multiple <em>fields</em>'],
          nested: ['<em>nested</em> field'],
          array: ['<em>array</em> element']
        }
      };
      
      const doc = createDoc(mockSource, complexHighlight, mockSearchEngine);
      expect(doc._highlight).toEqual(complexHighlight);
    });

    it('should handle null search engine', () => {
      const doc = createDoc(mockSource, mockHighlight, null);
      expect(doc).toBeDefined();
      expect(doc._source).toEqual(mockSource);
      expect(doc._highlight).toEqual(mockHighlight);
    });

    it('should handle undefined search engine', () => {
      const doc = createDoc(mockSource, mockHighlight, undefined);
      expect(doc).toBeDefined();
      expect(doc._source).toEqual(mockSource);
      expect(doc._highlight).toEqual(mockHighlight);
    });

    it('should handle empty string search engine', () => {
      const doc = createDoc(mockSource, mockHighlight, '');
      expect(doc).toBeDefined();
      expect(doc._source).toEqual(mockSource);
      expect(doc._highlight).toEqual(mockHighlight);
    });

    it('should properly create doc with minimal data', () => {
      const minimalSource = { id: '789' };
      const minimalHighlight = {};
      const doc = createDoc(minimalSource, minimalHighlight, mockSearchEngine);
      
      expect(doc._source).toEqual(minimalSource);
      expect(doc._highlight).toEqual(minimalHighlight);
      expect(doc._explain).toBeNull();
    });
  });
});
