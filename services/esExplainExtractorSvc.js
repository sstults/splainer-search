'use strict';

import { normalDocsSvc } from './normalDocSvc.js';
import { explainSvc } from './explainSvc.js';
import { fieldSpecSvc } from './fieldSpecSvc.js';

/**
 * Service for extracting explain information from Elasticsearch documents
 */
export class EsExplainExtractorSvc {
  constructor() {
    this.normalDocsSvc = normalDocsSvc(explainSvc);
    this.fieldSpecSvc = fieldSpecSvc();
  }

  /**
   * Get overriding explain information for a document
   * @param {Object} doc - Document to get explain for
   * @param {Object} fieldSpec - Field specification
   * @param {Object} explainData - Explain data
   * @returns {Object|null} Explain information or null
   */
  getOverridingExplain(doc, fieldSpec, explainData) {
    const idFieldName = fieldSpec.id;
    const id = doc[idFieldName];

    if (id && explainData && Object.hasOwn(explainData, id)) {
      return explainData[id];
    }

    return null;
  }

  /**
   * Process documents with explain information
   * @param {Array} docs - Array of documents to process
   * @param {Object} fieldSpec - Field specification for document processing
   * @param {Object} explainData - Explain data from Elasticsearch
   * @returns {Array} Array of processed documents with explain information
   */
  docsWithExplainOther(docs, fieldSpec, explainData) {
    const parsedDocs = [];

    docs.forEach((doc) => {
      const overridingExplain = this.getOverridingExplain(doc, fieldSpec, explainData);
      const normalDoc = this.normalDocsSvc.createNormalDoc(fieldSpec, doc, overridingExplain);
      parsedDocs.push(normalDoc);
    });

    return parsedDocs;
  }
}
