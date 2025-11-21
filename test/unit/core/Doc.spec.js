import { describe, it, expect } from 'vitest';
import { Doc } from '../../../core/Doc.js';

describe('Doc', () => {
  describe('creation', () => {
    it('should create a doc', () => {
      const source = { id: '1', title: 'Test Document' };
      const highlight = { title: ['Test'] };
      const document = new Doc({ source, highlight, explain: null });
      expect(document).toBeDefined();
      expect(document.id).toBe('1');
      expect(document.title).toBe('Test Document');
    });
  });
  
  describe('source()', () => {
    it('should return the normalized source map', () => {
      const source = { id: '1', title: 'Test Document' };
      const document = new Doc({ source, highlight: null, explain: null });
      expect(document.source()).toEqual(source);
    });
  });
  
  describe('highlight()', () => {
    it('should return empty string when no highlights', () => {
      const document = new Doc({ source: { id: '1' }, highlight: null, explain: null });
      expect(document.highlight('1', 'title', '<b>', '</b>')).toBe('');
    });
    
    it('should return highlighted text with pre/post tags', () => {
      const highlight = { '1': { title: ['Test'] } };
      const document = new Doc({ source: { id: '1' }, highlight, explain: null });
      expect(document.highlight('1', 'title', '<b>', '</b>')).toBe('<b>Test</b>');
    });
    
    it('should handle multiple highlight fragments', () => {
      const highlight = { '1': { title: ['Test', 'Document'] } };
      const document = new Doc({ source: { id: '1' }, highlight, explain: null });
      expect(document.highlight('1', 'title', '<b>', '</b>')).toBe('<b>Test</b> <b>Document</b>');
    });
    
    it('should preserve HTML tags in fragments', () => {
      const highlight = { '1': { title: ['<em>Test</em>'] } };
      const document = new Doc({ source: { id: '1' }, highlight, explain: null });
      expect(document.highlight('1', 'title', '<b>', '</b>')).toBe('<em>Test</em>');
    });
  });
  
  describe('explain()', () => {
    it('should throw NotSupported error when no explain data', () => {
      const document = new Doc({ source: { id: '1' }, highlight: null, explain: null });
      expect(() => document.explain('1')).toThrow('NotSupported');
    });
    
    it('should return explain data when available', () => {
      const explain = { '1': { raw: 'test explanation' } };
      const document = new Doc({ source: { id: '1' }, highlight: null, explain });
      expect(document.explain('1')).toEqual({ raw: 'test explanation' });
    });
  });
});
