'use strict';

export function vectaraSearcherPreprocessorSvc(queryTemplateSvc, defaultVectaraConfig) {
  const self = this;

  // Functions
  self.prepare  = prepare;

  const replaceQuery = function(qOption, args, queryText) {
    return queryTemplateSvc.hydrate(args, queryText, {qOption: qOption, encodeURI: false, defaultKw: '\\"\\"'});
  };

  var preparePostRequest = function (searcher) {
    var pagerArgs = JSON.parse(JSON.stringify(searcher.args.pager));
    if ( pagerArgs === undefined || pagerArgs === null ) {
      pagerArgs = {};
    }

    var defaultPagerArgs = {};

    searcher.pagerArgs  = Object.assign({}, defaultPagerArgs, pagerArgs);
    delete searcher.args.pager;

    var queryDsl    = replaceQuery(searcher.config.qOption, searcher.args, searcher.queryText);

    searcher.queryDsl   = queryDsl;
  };

  function prepare (searcher) {
    if (searcher.config === undefined) {
      searcher.config = defaultVectaraConfig;
    } else {
      // make sure config params that weren't passed through are set from
      // the default config object.
      searcher.config = Object.assign({}, defaultVectaraConfig, searcher.config);
    }

    preparePostRequest(searcher);
  }
}
