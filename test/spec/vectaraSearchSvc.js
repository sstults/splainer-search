'use strict';

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createSearcher } from '../../src/services/searchSvc.js';
import { fieldSpecSvc } from '../../src/services/fieldSpecSvc.js';

describe('Service: searchSvc: Vectara', () => {
  let searcher;
  let fieldSpecService;

  beforeEach(() => {
    fieldSpecService = new fieldSpecSvc();
    const fieldSpec = fieldSpecService.createFieldSpec('id field1 field2');
    searcher = createSearcher(
      fieldSpec,
      'https://api.vectara.io/v1/query',
      { numResults: 10 },
      'test',
      {},
      'vectara'
    );
    searcher.params = searcher.config.args;
    searcher.queryText = searcher.config.queryText;
  });

  it('uses q for vectara requests', async () => {
    searcher.adapter.search = vi.fn().mockResolvedValue({ docs: [], total: 0 });

    await searcher.search();

    expect(searcher.adapter.search).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'test', numResults: 10 })
    );
  });

  it('returns docs from adapter results', async () => {
    searcher.adapter.search = vi.fn().mockResolvedValue({
      docs: [
        { id: '1', field1: '1--field1 value', field2: '1--field2 value' },
        { id: '2', field1: '2--field1 value', field2: '2--field2 value' }
      ],
      total: 2
    });

    const result = await searcher.search();

    expect(result.docs).toHaveLength(2);
    expect(result.docs[0].field1).toBe('1--field1 value');
    expect(result.total).toBe(2);
  });
});
