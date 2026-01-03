'use strict';

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createSearcher } from '../../src/services/searchSvc.js';
import { fieldSpecSvc } from '../../src/services/fieldSpecSvc.js';

describe('Service: searchSvc: ElasticSearch', () => {
  let searcher;
  let fieldSpecService;

  beforeEach(() => {
    fieldSpecService = new fieldSpecSvc();
    const fieldSpec = fieldSpecService.createFieldSpec('id title');
    searcher = createSearcher(
      fieldSpec,
      'http://localhost:9200/index/_search',
      { size: 10 },
      'elastic',
      {},
      'es'
    );
    searcher.params = searcher.config.args;
    searcher.queryText = searcher.config.queryText;
  });

  it('uses q for elasticsearch requests', async () => {
    searcher.adapter.search = vi.fn().mockResolvedValue({ docs: [], total: 0 });

    await searcher.search();

    expect(searcher.adapter.search).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'elastic', size: 10 })
    );
    const params = searcher.adapter.search.mock.calls[0][0];
    expect(params.query).toBeUndefined();
  });

  it('normalizes hits.hits into docs', async () => {
    searcher.adapter.search = vi.fn().mockResolvedValue({
      hits: {
        hits: [{ _source: { id: 5039, title: 'Rambo' } }],
        total: { value: 1 }
      }
    });

    const result = await searcher.search();

    expect(result.docs).toEqual([{ id: 5039, title: 'Rambo' }]);
    expect(result.total).toBe(1);
  });
});
