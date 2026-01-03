'use strict';

import { describe, expect, it, beforeEach } from 'vitest';
import { createSearcher } from '../../src/services/searchSvc.js';
import { fieldSpecSvc } from '../../src/services/fieldSpecSvc.js';

describe('Service: searchSvc: Algolia', () => {
  let fieldSpecService;
  let fieldSpec;

  beforeEach(() => {
    fieldSpecService = new fieldSpecSvc();
    fieldSpec = fieldSpecService.createFieldSpec('id title');
  });

  it('throws because Algolia is deprecated in searchSvc', () => {
    expect(() => {
      createSearcher(
        fieldSpec,
        'https://example.com/indexes/query',
        { query: '#$query##' },
        'post',
        { apiMethod: 'POST' },
        'algolia'
      );
    }).toThrow('Algolia search engine is not supported in this version of the codebase');
  });
});
