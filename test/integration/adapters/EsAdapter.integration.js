import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EsAdapter } from '../../../adapters/elasticsearch/EsAdapter.js';
import { Searcher } from '../../../core/Searcher.js';
import { GenericContainer } from 'testcontainers';
import axios from 'axios';

// Testcontainers-based integration test for Elasticsearch adapter
describe('EsAdapter Testcontainers Integration', () => {
  let adapter;
  let container;
  let testIndex = 'test_index_testcontainers';
  const dockerImage = 'docker.elastic.co/elasticsearch/elasticsearch:7.17.17';
  
  beforeEach(async () => {
    try {
      // Start Elasticsearch container
      container = await new GenericContainer(dockerImage)
        .withExposedPorts(9200)
        .withEnv('discovery.type', 'single-node')
        .withEnv('xpack.security.enabled', 'false')
        .withEnv('ES_JAVA_OPTS', '-Xms1g -Xmx1g')
        .withWaitStrategy(
          'http://localhost:9200/_cluster/health?wait_for_status=green&timeout=60s'
        )
        .start();

      const host = container.getHost();
      const port = container.getMappedPort(9200);
      const baseUrl = `http://${host}:${port}`;

      // Setup test index and documents
      const client = axios.create({
        baseURL: baseUrl,
        timeout: 5000
      });

      // Create test index
      await client.put(`/${testIndex}`, {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        },
        mappings: {
          properties: {
            id: { type: 'integer' },
            title: { type: 'text' },
            content: { type: 'text' },
            category: { type: 'keyword' },
            tags: { type: 'keyword' }
          }
        }
      });

      // Index test documents
      const documents = [
        {
          id: 1,
          title: 'Introduction to Elasticsearch',
          content: 'Elasticsearch is a distributed search and analytics engine built on Apache Lucene.',
          category: 'tutorial',
          tags: ['elasticsearch', 'search', 'tutorial']
        },
        {
          id: 2,
          title: 'Advanced Search Techniques',
          content: 'Learn advanced search techniques including fuzzy matching, phrase matching, and boolean queries.',
          category: 'advanced',
          tags: ['search', 'advanced', 'techniques']
        },
        {
          id: 3,
          title: 'Docker for Search Engines',
          content: 'Using Docker to run and manage search engines like Elasticsearch and Solr.',
          category: 'docker',
          tags: ['docker', 'search', 'containers']
        }
      ];

      // Bulk index documents
      const bulkBody = documents.flatMap(doc => [
        { index: { _index: testIndex, _id: doc.id } },
        doc
      ]);

      await client.post(`/_bulk`, bulkBody, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Initialize adapter after container is ready
      adapter = new EsAdapter({
        host: baseUrl,
        index: testIndex
      });
    } catch (error) {
      console.error('Failed to setup test environment:', error);
      throw error;
    }
  });

  afterEach(async () => {
    try {
      if (container) {
        await container.stop();
      }
    } catch (error) {
      console.error('Failed to cleanup container:', error);
    }
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(adapter.config).toEqual({
        host: expect.stringContaining('http://'),
        index: testIndex
      });
    });
  });

  describe('search method', () => {
    it('should return search results from Elasticsearch', async () => {
      const searchParams = {
        q: 'elasticsearch',
        size: 10,
        from: 0
      };

      const result = await adapter.search(searchParams);

      expect(result).toHaveProperty('hits');
      expect(result).toHaveProperty('timed_out');
      expect(result).toHaveProperty('took');
      expect(result.hits).toHaveProperty('hits');
      expect(result.hits).toHaveProperty('total');
    });

    it('should handle different search parameters', async () => {
      const testParams = [
        { q: 'introduction', size: 5, from: 0 },
        { q: 'advanced search', size: 20, from: 10 },
        { q: '', size: 100, from: 0 },
        { q: 'docker containers', size: 10, from: 0 }
      ];

      for (const params of testParams) {
        const result = await adapter.search(params);
        expect(result).toHaveProperty('hits');
        expect(result).toHaveProperty('timed_out');
        expect(result).toHaveProperty('took');
      }
    });

    it('should return documents with correct structure', async () => {
      const result = await adapter.search({
        q: 'tutorial',
        size: 5,
        from: 0
      });

      expect(result.hits).toHaveProperty('hits');
      expect(result.hits.hits).toBeInstanceOf(Array);
      
      if (result.hits.hits.length > 0) {
        const firstHit = result.hits.hits[0];
        expect(firstHit).toHaveProperty('_id');
        expect(firstHit).toHaveProperty('_source');
        expect(firstHit._source).toHaveProperty('id');
        expect(firstHit._source).toHaveProperty('title');
        expect(firstHit._source).toHaveProperty('content');
      }
    });

    it('should handle search with filters', async () => {
      const result = await adapter.search({
        q: 'search',
        size: 10,
        from: 0
      });

      expect(result.hits).toHaveProperty('total');
      expect(result.hits.total).toBeGreaterThan(0);
    });
  });

  describe('integration with Searcher', () => {
    it('should work correctly with Searcher class using testcontainers', async () => {
      const searcher = new Searcher(
        adapter,
        ['title', 'content'],
        `${container.getHost()}:${container.getMappedPort(9200)}/${testIndex}/_search`,
        { size: 10, from: 0 },
        'elasticsearch',
        { transport: 'http' },
        'elasticsearch'
      );

      const result = await searcher.search();
      
      expect(result).toHaveProperty('docs');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('took');
    });
  });

  describe('edge cases', () => {
    it('should handle empty search results gracefully', async () => {
      const result = await adapter.search({
        q: 'thisqueryshouldnotmatchanything',
        size: 10,
        from: 0
      });

      expect(result).toHaveProperty('hits');
      expect(result.hits).toHaveProperty('hits');
      expect(result.hits).toHaveProperty('total');
      // Should have 0 hits
      expect(result.hits.total).toBe(0);
    });

    it('should handle large result sets', async () => {
      const result = await adapter.search({
        q: 'search',
        size: 100,
        from: 0
      });

      expect(result).toHaveProperty('hits');
      expect(result.hits).toHaveProperty('total');
    });
  });
}
