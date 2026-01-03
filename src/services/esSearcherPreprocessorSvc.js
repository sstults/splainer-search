'use strict';

import { copyObject, mergeObjects, isDefined } from './objectUtils.js';

// Service implementation
export function esSearcherPreprocessorSvc(queryTemplateSvc, defaultESConfig) {
  const self = this;

  // Attributes
  // field name since ES 5.0
  self.fieldsParamNames = [ '_source'];

  // Functions
  self.prepare  = prepare;

  const replaceQuery = function(qOption, args, queryText) {
    // Allows full override of query if a JSON friendly format is sent in
    if (queryText instanceof Object) {
      return queryText;
    } else {
      if (queryText) {
        queryText = queryText.replace(/\\/g, '\\\\');
        queryText = queryText.replace(/"/g, '\\"');
      }
      return queryTemplateSvc.hydrate(args, queryText, {qOption: qOption, encodeURI: false, defaultKw: '""'});
    }
  };

  const prepareHighlighting = function (args, fields) {
    if ( isDefined(fields) && fields !== null ) {
      if (Object.hasOwn && Object.hasOwn(fields, 'fields')) {
        fields = fields.fields;
      } else if ('fields' in fields) {
        fields = fields.fields;
      }

      if ( fields.length > 0 ) {
        const hl = { fields: {} };

        fields.forEach(function(fieldName) {
          /*
           * ES doesn't like highlighting on _id if the query has been filtered on _id using a terms query.
           */
          if (fieldName === '_id') {
            return;
          }

          hl.fields[fieldName] = { };
        });

        return hl;
      }
    }

    return {
      fields: {
        _all: {}
      }
    };
  };

  const preparePostRequest = function (searcher) {
    let pagerArgs = copyObject(searcher.args.pager);
    if ( isDefined(pagerArgs) && pagerArgs !== null ) {
      pagerArgs = {};
    }

    const defaultPagerArgs = {
      from: 0,
      size: searcher.config.numberOfRows,
    };

    searcher.pagerArgs  = mergeObjects({}, defaultPagerArgs, pagerArgs);
    delete searcher.args.pager;

    let queryDsl        = replaceQuery(searcher.config.qOption, searcher.args, searcher.queryText);
    queryDsl.explain    = true;
    queryDsl.profile    = true;

    if ( isDefined(searcher.fieldList) && searcher.fieldList !== null ) {
      self.fieldsParamNames.forEach(function(name) {
        queryDsl[name] = searcher.fieldList;
      });
    }

    if (!(Object.hasOwn && Object.hasOwn(queryDsl, 'highlight')) && !('highlight' in queryDsl)) {
      queryDsl.highlight = prepareHighlighting(searcher.args, queryDsl[self.fieldsParamNames[0]]);
    }

    searcher.queryDsl   = queryDsl;
  };

  const prepareGetRequest = function (searcher) {
    searcher.url = searcher.url + '?q=' + searcher.queryText;

    let pagerArgs = copyObject(searcher.args.pager);
    delete searcher.args.pager;

    if ( isDefined(pagerArgs) && pagerArgs !== null ) {
      searcher.url += '&from=' + pagerArgs.from;
      searcher.url += '&size=' + pagerArgs.size;
    } else {
      searcher.url += '&size=' + searcher.config.numberOfRows;
    }
  };

  function prepare (searcher) {
    if (searcher.config === undefined) {
      searcher.config = defaultESConfig;
    } else {
      // make sure config params that weren't passed through are set from
      // the default config object.
      searcher.config = mergeObjects({}, defaultESConfig, searcher.config);
    }

    if ( searcher.config.apiMethod === 'POST') {
      preparePostRequest(searcher);
    } else if ( searcher.config.apiMethod === 'GET') {
      prepareGetRequest(searcher);
    }
  }
}
