'use strict';

// Test for Solr Explain Extractor Service using plain JavaScript
import { describe, it, beforeEach, expect } from 'vitest';
import { solrExplainExtractorSvc } from '../../src/services/solrExplainExtractorSvc.js';

describe('Service: solrExplainExtractorSvc', () => {
  let solrExplainExtractorSvcInstance;
  let normalDocsSvcInstance;

  beforeEach(() => {
    // Mock the normalDocsSvc
    normalDocsSvcInstance = {
      createNormalDoc: () => {}
    };
    
    // Create the service instance
    solrExplainExtractorSvcInstance = new solrExplainExtractorSvc(normalDocsSvcInstance);
  });

  describe('getOverridingExplain', () => {
    it('should return explain data when id exists in explainData', () => {
      const mockDoc = { id: 'test-id' };
      const mockFieldSpec = { id: 'id' };
      const mockExplainData = { 
        'test-id': { 
          value: 1.0, 
          description: 'test explanation',
          details: []
        } 
      };
      
      const result = solrExplainExtractorSvcInstance.getOverridingExplain(mockDoc, mockFieldSpec, mockExplainData);
      expect(result).toEqual({
        value: 1.0, 
        description: 'test explanation',
        details: []
      });
    });

    it('should return null when no explain data is provided', () => {
      const mockDoc = { id: 'test-id' };
      const mockFieldSpec = { id: 'id' };
      
      const result = solrExplainExtractorSvcInstance.getOverridingExplain(mockDoc, mockFieldSpec, null);
      expect(result).toBeNull();
    });

    it('should return null when doc id is not found in explainData', () => {
      const mockDoc = { id: 'non-existent-id' };
      const mockFieldSpec = { id: 'id' };
      const mockExplainData = { 
        'test-id': { 
          value: 1.0, 
          description: 'test explanation',
          details: []
        } 
      };
      
      const result = solrExplainExtractorSvcInstance.getOverridingExplain(mockDoc, mockFieldSpec, mockExplainData);
      expect(result).toBeNull();
    });

    it('should return null when doc has no id field', () => {
      const mockDoc = { title: 'test-title' };
      const mockFieldSpec = { id: 'id' };
      const mockExplainData = { 
        'test-id': { 
          value: 1.0, 
          description: 'test explanation',
          details: []
        } 
      };
      
      const result = solrExplainExtractorSvcInstance.getOverridingExplain(mockDoc, mockFieldSpec, mockExplainData);
      expect(result).toBeNull();
    });
  });

  describe('docsWithExplainOther', () => {
    it('should process docs with explain data and return normal docs', () => {
      const mockFieldSpec = { id: 'id' };
      const mockExplainData = { 
        'test-id': { 
          value: 1.0, 
          description: 'test explanation',
          details: []
        } 
      };
      
      const mockDocs = [
        { id: 'test-id', title: 'Test Title' },
        { id: 'test-id-2', title: 'Test Title 2' }
      ];
      
      // Mock the createNormalDoc function to return a test object
      normalDocsSvcInstance.createNormalDoc = () => ({
        id: 'test-id',
        title: 'Test Title',
        explain: () => {},
        hotMatches: () => {},
        score: () => {}
      });
      
      const result = solrExplainExtractorSvcInstance.docsWithExplainOther(mockDocs, mockFieldSpec, mockExplainData);
      expect(result).toHaveLength(2);
    });

    it('should handle empty docs array', () => {
      const mockFieldSpec = { id: 'id' };
      const mockExplainData = { 
        'test-id': { 
          value: 1.0, 
          description: 'test explanation',
          details: []
        } 
      };
      
      const mockDocs = [];
      
      const result = solrExplainExtractorSvcInstance.docsWithExplainOther(mockDocs, mockFieldSpec, mockExplainData);
      expect(result).toHaveLength(0);
    });

    it('should pass explain data to createNormalDoc', () => {
      const mockFieldSpec = { id: 'id' };
      const mockExplainData = { 
        'test-id': { 
          value: 1.0, 
          description: 'test explanation',
          details: []
        } 
      };
      
      const mockDocs = [
        { id: 'test-id', title: 'Test Title' }
      ];
      
      // Mock the createNormalDoc function to return a test object
      normalDocsSvcInstance.createNormalDoc = () => ({
        id: 'test-id',
        title: 'Test Title',
        explain: () => {},
        hotMatches: () => {},
        score: () => {}
      });
      
      const result = solrExplainExtractorSvcInstance.docsWithExplainOther(mockDocs, mockFieldSpec, mockExplainData);
      expect(result).toHaveLength(1);
    });
  });
});
