'use strict';

// Executes a generic search and returns
// a set of generic documents

// PRE and POST strings, can't just use HTML
// because Solr doesn't appear to support escaping
// XML/HTML tags in the content. So we do this stupid thing
const HIGHLIGHTING_PRE    = 'aouaoeuCRAZY_STRING!8_______';
const HIGHLIGHTING_POST   = '62362iueaiCRAZY_POST_STRING!_______';

import { copyObject } from './objectUtils.js';
import { createSolrSearcher } from '../factories/solrSearcherFactory.js';
import { createEsSearcher } from '../factories/esSearcherFactory.js';
import { createVectaraSearcher } from '../factories/vectaraSearcherFactory.js';
import { createSearchApiSearcher } from '../factories/searchApiSearcherFactory.js';

export function configFromDefault(defaultSolrConfig) {
  return copyObject(defaultSolrConfig);
}

export function createSearcher(fieldSpec, url, args, queryText, config, searchEngine) {
  if (searchEngine === undefined) {
    searchEngine = 'solr';
  }

  const options = {
    fieldList:      fieldSpec.fieldList(),
    hlFieldList:    fieldSpec.highlightFieldList(),
    url:            url,
    args:           args,
    queryText:      queryText,
    config:         config,
    type:           searchEngine
  };

  if (options.config && options.config.basicAuthCredential && options.config.basicAuthCredential.length > 0) {
    // set up basic auth as a header
    const encoded = btoa(options.config.basicAuthCredential);
    if (options.config.customHeaders && options.config.customHeaders.length > 0) {
      // already something there, append a new entry
      const head = JSON.parse(options.config.customHeaders);
      head['Authorization'] = 'Basic ' + encoded;
      options.config.customHeaders = JSON.stringify(head);
    } else {
      // empty, so insert
      const head = { 'Authorization': 'Basic ' + encoded };
      options.config.customHeaders = JSON.stringify(head);
    }
  }
  
  let searcher;
  
  if (searchEngine === 'solr') {
    options.HIGHLIGHTING_PRE  = HIGHLIGHTING_PRE;
    options.HIGHLIGHTING_POST = HIGHLIGHTING_POST;

    searcher = createSolrSearcher(options);
  } else if (searchEngine === 'es') {
    searcher = createEsSearcher(options);
  } else if (searchEngine === 'os') {
    searcher = createEsSearcher(options);
  } else if (searchEngine === 'vectara') {
    searcher = createVectaraSearcher(options);
  } else if (searchEngine === 'algolia') {
    // Algolia is not implemented in this version of the codebase
    throw new Error('Algolia search engine is not supported in this version of the codebase');
  } else if (searchEngine === 'searchapi') {
    searcher = createSearchApiSearcher(options);
  }

  return searcher;
}

export function activeQueries(activeQueriesCount) {
  return activeQueriesCount;
}
