'use strict';

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createSearcher } from '../../src/services/searchSvc.js';
import { fieldSpecSvc } from '../../src/services/fieldSpecSvc.js';

describe('Service: searchSvc: SearchApi', () => {
  let searcher;
  let fieldSpecService;

  beforeEach(() => {
    fieldSpecService = new fieldSpecSvc();
    const fieldSpec = fieldSpecService.createFieldSpec('id title');
    searcher = createSearcher(
      fieldSpec,
      'http://example.com/api/search',
      { query: '#$query##' },
      'rambo movie',
      { apiMethod: 'GET' },
      'searchapi'
    );
    searcher.params = searcher.config.args;
    searcher.queryText = searcher.config.queryText;
  });

  it('uses the query parameter for searchapi requests', async () => {
    searcher.adapter.search = vi.fn().mockResolvedValue({ docs: [], total: 0 });

    await searcher.search();

    expect(searcher.adapter.search).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'rambo movie' })
    );
    const params = searcher.adapter.search.mock.calls[0][0];
    expect(params.q).toBeUndefined();
  });

  it('normalizes results from a results array', async () => {
    searcher.adapter.search = vi.fn().mockResolvedValue({
      results: [
        { id: 1, title: 'Rambo' },
        { id: 2, title: 'Rambo II' }
      ],
      total: 2
    });

    const result = await searcher.search();

    expect(result.docs).toHaveLength(2);
    expect(result.docs[0].title).toBe('Rambo');
    expect(result.total).toBe(2);
  });
});
