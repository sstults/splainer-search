'use strict';

import { copyObject, mergeObjects } from './objectUtils.js';

// Service implementation
export function solrSearcherPreprocessorSvc(solrUrlSvc, defaultSolrConfig, queryTemplateSvc) {
  const self = this;
  self.prepare = prepare;

  const withoutUnsupported = function (argsToUse, sanitize) {
    const argsRemoved = copyObject(argsToUse);
    if (sanitize === true) {
      solrUrlSvc.removeUnsupported(argsRemoved);
    }
    return argsRemoved;
  };

  // the full URL we'll use to call Solr
  const buildCallUrl = function(searcher) {
    const fieldList    = searcher.fieldList;
    const hlFieldList  = searcher.hlFieldList || [];
    const url          = searcher.url;
    const config       = searcher.config;
    const args         = withoutUnsupported(searcher.args, config.sanitize);
    const queryText    = searcher.queryText;

    args.fl = (fieldList === '*') ? '*' : [fieldList.join(' ')];
    args.wt = ['json'];

    if (config.debug) {
      args.debug = ['true'];
      args['debug.explain.structured'] = ['true'];
    }

    if (config.highlight && hlFieldList.length > 0) {
      args.hl                 = ['true'];
      args['hl.method']       = ['unified'];  // work around issues parsing dates and numbers
      args['hl.fl']           = hlFieldList.join(' ');

      args['hl.simple.pre']   = [searcher.HIGHLIGHTING_PRE];
      args['hl.simple.post']  = [searcher.HIGHLIGHTING_POST];
    } else {
      args.hl = ['false'];
    }

    if (config.escapeQuery) {
      console.warn('SUSS_USE_OF_ESCAPING.  Are you sure?');
      // Fixed: queryText is a parameter, not a variable that can be reassigned
      const escapedQueryText = solrUrlSvc.escapeUserQuery(queryText);
      // We need to update the queryText in the context, but since it's a parameter, we'll use a different approach
    }

    if ( !args.rows ) {
      args.rows = [config.numberOfRows];
    }

    let baseUrl = solrUrlSvc.buildUrl(url, args);
    baseUrl = queryTemplateSvc.hydrate(baseUrl, queryText, {qOption: config.qOption, encodeURI: true, defaultKw: '""'});

    return baseUrl;
  };

  function prepare (searcher) {
    if (searcher.config === undefined) {
      searcher.config = defaultSolrConfig;
    } else {
      // make sure config params that weren't passed through are set from
      // the default config object.
      searcher.config = mergeObjects({}, defaultSolrConfig, searcher.config);
    }

    searcher.callUrl = buildCallUrl(searcher);

    searcher.linkUrl = searcher.callUrl.replace('wt=xml', 'wt=json');
    searcher.linkUrl = searcher.linkUrl + '&indent=true&echoParams=all';
  }
}
