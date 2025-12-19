import { describe, it, expect, vi } from 'vitest';
import { Searcher } from '../../core/Searcher.js';
import { EsAdapter } from '../../adapters/elasticsearch/EsAdapter.js';
import { SolrAdapter } from '../../adapters/solr/SolrAdapter.js';
import { AlgoliaAdapter } from '../../adapters/algolia/AlgoliaAdapter.js';

describe('Cross-Engine Integration', () => {
  describe('Searcher with different engine adapters', () => {
    it('should work with Elasticsearch adapter', async () => {
      const adapter = new EsAdapter({
        host: 'http://localhost:9200',
        index: 'test_index'
      });
      
      // Mock the adapter search method
      const mockSearch = vi.spyOn(adapter, 'search');
      mockSearch.mockResolvedValue({
        hits: [
          { _id: '1', _source: { id: 1, title: 'Elasticsearch Document 1', content: 'Content 1' } }
        ],
        total: 1,
        took: 5,
        timed_out: false
      });
      
      const searcher = new Searcher(
        adapter,
        ['title', 'content'],
        'http://localhost:9200/test_index/_search',
        { size: 10, from: 0 },
        'test query',
        { transport: 'http' },
        'elasticsearch'
      );
      
      const result = await searcher.search();
      
      expect(mockSearch).toHaveBeenCalled();
      expect(result.docs).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.engine).toBe('elasticsearch');
    });

    it('should work with Solr adapter', async () => {
      const adapter = new SolrAdapter({
        host: 'http://localhost:8983',
        core: 'test_core'
      });
      
      // Mock the adapter search method
      const mockSearch = vi.spyOn(adapter, 'search');
      mockSearch.mockResolvedValue({
        docs: [
          { id: 1, title: 'Solr Document 1', content: 'Content 1' }
        ],
        total: 1,
        responseHeader: {
          status: 0,
          QTime: 5
        }
      });
      
      const searcher = new Searcher(
        adapter,
        ['title', 'content'],
        'http://localhost:8983/solr/test_core/select',
        { rows: 10, start: 0 },
        'test query',
        { transport: 'http' },
        'solr'
      );
      
      const result = await searcher.search();
      
      expect(mockSearch).toHaveBeenCalled();
      expect(result.docs).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.engine).toBe('solr');
    });

    it('should work with Algolia adapter', async () => {
      const adapter = new AlgoliaAdapter({
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        indexName: 'test_index'
      });
      
      // Mock the adapter search method
      const mockSearch = vi.spyOn(adapter, 'search');
      mockSearch.mockResolvedValue({
        hits: [
          { objectID: '1', title: 'Algolia Document 1', content: 'Content 1' }
        ],
        nbHits: 1,
        processingTimeMS: 5
      });
      
      const searcher = new Searcher(
        adapter,
        ['title', 'content'],
        'https://test-app-id.algolia.net/1/indexes/test_index/search',
        { hitsPerPage: 10, page: 0 },
        'test query',
        { transport: 'http' },
        'algolia'
      );
      
      const result = await searcher.search();
      
      expect(mockSearch).toHaveBeenCalled();
      expect(result.docs).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.engine).toBe('algolia');
    });

    it('should maintain consistent interface across engines', async () => {
      const adapters = [
        { 
          adapter: new EsAdapter({ host: 'http://localhost:9200', index: 'test_index' }),
          engine: 'elasticsearch',
          url: 'http://localhost:9200/test_index/_search'
        },
        { 
          adapter: new SolrAdapter({ host: 'http://localhost:8983', core: 'test_core' }),
          engine: 'solr',
          url: 'http://localhost:8983/solr/test_core/select'
        },
        { 
          adapter: new AlgoliaAdapter({ appId: 'test-app-id', apiKey: 'test-api-key', indexName: 'test_index' }),
          engine: 'algolia',
          url: 'https://test-app-id.algolia.net/1/indexes/test_index/search'
        }
      ];

      for (const { adapter, engine, url } of adapters) {
        // Mock the adapter search method
        const mockSearch = vi.spyOn(adapter, 'search');
        mockSearch.mockResolvedValue({
          hits: [{ _id: '1', _source: { id: 1, title: 'Test Document', content: 'Content' } }],
          total: 1,
          took: 5,
          timed_out: false
        });
        
        const searcher = new Searcher(
          adapter,
          ['title', 'content'],
          url,
          { size: 10, from: 0 },
          'test query',
          { transport: 'http' },
          engine
        );
        
        const result = await searcher.search();
        
        expect(result).toHaveProperty('docs');
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('engine');
        expect(result.engine).toBe(engine);
      }
    });
  });
});
