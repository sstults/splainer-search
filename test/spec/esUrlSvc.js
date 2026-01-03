'use strict';

import { describe, it, expect, beforeEach } from 'vitest';
import { esUrlSvc } from '../../src/services/esUrlSvc.js';

describe('esUrlSvc', () => {
  let esUrlService;

  beforeEach(() => {
    esUrlService = new esUrlSvc();
  });

  it('parses urls with protocol', () => {
    const url = 'http://localhost:9200/myindex/_search';
    const result = esUrlService.parseUrl(url);
    expect(result.protocol).toBe('http:');
    expect(result.host).toBe('localhost:9200');
    expect(result.pathname).toBe('/myindex/_search');
    expect(result.username).toBe('');
    expect(result.password).toBe('');
    expect(result.query).toBe('');
  });

  it('parses urls without protocol', () => {
    const url = 'localhost:9200/myindex/_search';
    const result = esUrlService.parseUrl(url);
    expect(result.protocol).toBe('http:');
    expect(result.host).toBe('localhost:9200');
    expect(result.pathname).toBe('/myindex/_search');
  });

  it('parses urls with https protocol', () => {
    const url = 'https://localhost:9200/myindex/_search';
    const result = esUrlService.parseUrl(url);
    expect(result.protocol).toBe('https:');
    expect(result.host).toBe('localhost:9200');
    expect(result.pathname).toBe('/myindex/_search');
  });

  it('parses urls with username and password', () => {
    const url = 'http://user:pass@localhost:9200/myindex/_search';
    const result = esUrlService.parseUrl(url);
    expect(result.username).toBe('user');
    expect(result.password).toBe('pass');
  });

  it('builds base urls', () => {
    const uri = { protocol: 'http:', host: 'localhost:9200' };
    expect(esUrlService.buildBaseUrl(uri)).toBe('http://localhost:9200');
  });

  it('builds doc urls', () => {
    const uri = { protocol: 'http:', host: 'localhost:9200' };
    const doc = { _index: 'myindex', _type: 'mytype', _id: '123' };
    const result = esUrlService.buildDocUrl(uri, doc, false);
    expect(result).toBe('http://localhost:9200/myindex/mytype/_doc/123?pretty=true');
  });

  it('builds explain doc urls', () => {
    const uri = { protocol: 'http:', host: 'localhost:9200' };
    const doc = { _index: 'myindex', _type: 'mytype', _id: '123' };
    const result = esUrlService.buildDocUrl(uri, doc, true);
    expect(result).toBe('http://localhost:9200/myindex/_explain/123');
  });

  it('builds explain urls', () => {
    const uri = { protocol: 'http:', host: 'localhost:9200' };
    const doc = { _index: 'myindex', _type: 'mytype', _id: '123' };
    const result = esUrlService.buildExplainUrl(uri, doc);
    expect(result).toBe('http://localhost:9200/myindex/_explain/123');
  });

  it('builds render template urls', () => {
    const uri = { protocol: 'http:', host: 'localhost:9200' };
    const result = esUrlService.buildRenderTemplateUrl(uri);
    expect(result).toBe('http://localhost:9200/_render/template');
  });

  it('builds urls with params', () => {
    const uri = {
      protocol: 'http:',
      host: 'localhost:9200',
      pathname: '/_search',
      params: {
        from: 10,
        size: 10
      }
    };
    const result = esUrlService.buildUrl(uri);
    expect(result).toBe('http://localhost:9200/_search?from=10&size=10');
  });

  it('detects bulk calls', () => {
    expect(esUrlService.isBulkCall({ pathname: '/_msearch' })).toBe(true);
    expect(esUrlService.isBulkCall({ pathname: '/_search' })).toBe(false);
  });

  it('detects template calls', () => {
    expect(esUrlService.isTemplateCall({ id: 'my-template-id' })).toBe(true);
    expect(esUrlService.isTemplateCall({ query: 'my-query' })).toBe(false);
  });

  it('strips basic auth', () => {
    const url = 'http://user:pass@localhost:9200/myindex/_search';
    expect(esUrlService.stripBasicAuth(url)).toBe('http://localhost:9200/myindex/_search');
  });

  it('returns custom headers when provided', () => {
    const uri = { username: 'user', password: 'pass' };
    const customHeaders = '{"Content-Type": "application/json"}';
    const result = esUrlService.getHeaders(uri, customHeaders);
    expect(result['Content-Type']).toBe('application/json');
  });

  it('adds basic auth headers when custom headers are empty', () => {
    const uri = { username: 'user', password: 'pass' };
    const result = esUrlService.getHeaders(uri, '');
    expect(result.Authorization).toMatch(/^Basic /);
  });
});
