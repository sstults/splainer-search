'use strict';

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createSearcher } from '../../src/services/searchSvc.js';
import { fieldSpecSvc } from '../../src/services/fieldSpecSvc.js';

describe('Service: searchSvc: Solr', () => {
  let searcher;
  let fieldSpecService;

  beforeEach(() => {
    fieldSpecService = new fieldSpecSvc();
    const fieldSpec = fieldSpecService.createFieldSpec('id title');
    searcher = createSearcher(
      fieldSpec,
      'http://localhost:8983/solr/collection/select',
      { rows: 10 },
      '*:*',
      {},
      'solr'
    );
    searcher.params = searcher.config.args;
    searcher.queryText = searcher.config.queryText;
  });

  it('uses q for solr requests', async () => {
    searcher.adapter.search = vi.fn().mockResolvedValue({ docs: [], total: 0 });

    await searcher.search();

    expect(searcher.adapter.search).toHaveBeenCalledWith(
      expect.objectContaining({ q: '*:*', rows: 10 })
    );
  });

  it('normalizes docs and total from response', async () => {
    searcher.adapter.search = vi.fn().mockResolvedValue({
      docs: [{ id: '1', title: 'Test Document' }],
      total: 1
    });

    const result = await searcher.search();

    expect(result.docs).toHaveLength(1);
    expect(result.docs[0].title).toBe('Test Document');
    expect(result.total).toBe(1);
  });
});
