'use strict';

import { normalDocsSvc } from './normalDocSvc.js';
import { explainSvc } from './explainSvc.js';
import { baseExplainSvc } from './baseExplainSvc.js';
import { fieldSpecSvc } from './fieldSpecSvc.js';
import { queryExplainSvc } from './queryExplainSvc.js';
import { simExplainSvc } from './simExplainSvc.js';
import { vectorSvc } from './vectorSvc.js';

/**
 * Service for extracting explain information from Elasticsearch documents
 */
export class EsExplainExtractorSvc {
  constructor() {
    const vectorService = new vectorSvc();
    const baseExplainService = new baseExplainSvc(vectorService);
    const simExplainService = new simExplainSvc();
    const queryExplainService = new queryExplainSvc(
      baseExplainService,
      vectorService,
      simExplainService
    );
    const explainService = new explainSvc(
      baseExplainService,
      queryExplainService,
      simExplainService
    );

    this.normalDocsSvc = new normalDocsSvc(explainService);
    this.fieldSpecSvc = new fieldSpecSvc();
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
