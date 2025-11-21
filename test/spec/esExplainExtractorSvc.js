'use strict';

// Test for Elasticsearch Explain Extractor Service using Vitest
import { describe, it, beforeEach, expect } from 'vitest';
import { EsExplainExtractorSvc } from '../../services/esExplainExtractorSvc.js';

describe('Service: EsExplainExtractorSvc', () => {
  let esExplainExtractorSvcInstance;

  beforeEach(() => {
    // Create the service instance
    esExplainExtractorSvcInstance = new EsExplainExtractorSvc();
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
      
      const result = esExplainExtractorSvcInstance.getOverridingExplain(mockDoc, mockFieldSpec, mockExplainData);
      expect(result).toEqual({
        value: 1.0, 
        description: 'test explanation',
        details: []
      });
    });

    it('should return null when no explain data is provided', () => {
      const mockDoc = { id: 'test-id' };
      const mockFieldSpec = { id: 'id' };
      
      const result = esExplainExtractorSvcInstance.getOverridingExplain(mockDoc, mockFieldSpec, null);
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
      
      const result = esExplainExtractorSvcInstance.getOverridingExplain(mockDoc, mockFieldSpec, mockExplainData);
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
      
      const result = esExplainExtractorSvcInstance.getOverridingExplain(mockDoc, mockFieldSpec, mockExplainData);
      expect(result).toBeNull();
    });

    it('should return null when explainData is undefined', () => {
      const mockDoc = { id: 'test-id' };
      const mockFieldSpec = { id: 'id' };
      
      const result = esExplainExtractorSvcInstance.getOverridingExplain(mockDoc, mockFieldSpec, undefined);
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
      
      const result = esExplainExtractorSvcInstance.docsWithExplainOther(mockDocs, mockFieldSpec, mockExplainData);
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
      
      const result = esExplainExtractorSvcInstance.docsWithExplainOther(mockDocs, mockFieldSpec, mockExplainData);
      expect(result).toHaveLength(0);
    });
  });
});
