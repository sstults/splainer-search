'use strict';

export function solrExplainExtractorSvc(normalDocsSvc) {
  var self = this;

  // Functions
  self.getOverridingExplain   = getOverridingExplain;
  self.docsWithExplainOther   = docsWithExplainOther;

  function getOverridingExplain(doc, fieldSpec, explainData) {
    var idFieldName = fieldSpec.id;
    var id          = doc[idFieldName];

    if (id && explainData && Object.hasOwn(explainData, id)) {
      return explainData[id];
    }

    return null;
  }

  function docsWithExplainOther(docs, fieldSpec, explainData) {
    var parsedDocs = [];

    Object.keys(docs).forEach(function(key) {
      var doc = docs[key];
      var overridingExplain = self.getOverridingExplain(doc, fieldSpec, explainData);
      var normalDoc         = normalDocsSvc.createNormalDoc(fieldSpec, doc, overridingExplain);

      parsedDocs.push(normalDoc);
    });

    return parsedDocs;
  }
}
