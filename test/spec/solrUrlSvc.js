'use strict';

import { describe, it, expect, beforeEach } from 'vitest';
import { solrUrlSvc } from '../../src/services/solrUrlSvc.js';

describe('solrUrlSvc', () => {
  let solrUrlService;

  beforeEach(() => {
    solrUrlService = new solrUrlSvc();
  });

  it('parses solr args', () => {
    const argStr = 'q=1234&q=5678&fq=cat:foo';
    const parsedArgs = solrUrlService.parseSolrArgs(argStr);
    expect(parsedArgs.q).toContain('1234');
    expect(parsedArgs.q).toContain('5678');
    expect(parsedArgs.q).toHaveLength(2);
    expect(parsedArgs.fq).toContain('cat:foo');
    expect(parsedArgs.fq).toHaveLength(1);
  });

  it('parses solr args with urlencoded values', () => {
    const argStr = 'q=1234%20foo&q=5678&fq=cat:foo';
    const parsedArgs = solrUrlService.parseSolrArgs(argStr);
    expect(parsedArgs.q).toContain('1234 foo');
  });

  it('parses solr urls', () => {
    const urlStr = 'http://localhost:8983/solr/collection1/select?q=*:*';
    const parsedSolrUrl = solrUrlService.parseSolrUrl(urlStr);
    expect(parsedSolrUrl.protocol).toBe('http:');
    expect(parsedSolrUrl.host).toBe('localhost:8983');
    expect(parsedSolrUrl.collectionName).toBe('collection1');
    expect(parsedSolrUrl.requestHandler).toBe('select');
    expect(parsedSolrUrl.solrArgs.q).toContain('*:*');
  });

  it('parses solr urls missing protocol', () => {
    const urlStr = 'localhost:8983/solr/collection1/select?q=*:*';
    const parsedSolrUrl = solrUrlService.parseSolrUrl(urlStr);
    expect(parsedSolrUrl.protocol).toBe('http:');
    expect(parsedSolrUrl.host).toBe('localhost:8983');
    expect(parsedSolrUrl.collectionName).toBe('collection1');
    expect(parsedSolrUrl.requestHandler).toBe('select');
    expect(parsedSolrUrl.solrArgs.q).toContain('*:*');
  });

  it('builds urls from args', () => {
    const url = solrUrlService.buildUrl('www.example.com', { a: 'b', c: 'd' });
    expect(url).toBe('http://www.example.com?a=b&c=d');
  });

  it('builds urls with array values', () => {
    const url = solrUrlService.buildUrl('www.example.com', { a: ['b', 'b'], c: 'd' });
    expect(url).toBe('http://www.example.com?a=b&a=b&c=d');
  });

  it('escapes user queries', () => {
    const escaped = solrUrlService.escapeUserQuery('+-&!()[]{}^"~?:\\');
    expect(escaped).toBe('\\+\\-\\&\\!\\(\\)\\[\\]\\{\\}\\^\\"\\~\\?\\:\\\\');
  });

  it('formats and parses solr args roundtrip', () => {
    const solrArgs = { q: ['*:*'], fq: ['title:bar', 'text:foo'] };
    const formatted = solrUrlService.formatSolrArgs(solrArgs);
    const parsedBack = solrUrlService.parseSolrArgs(formatted);

    Object.keys(solrArgs).forEach((key) => {
      expect(parsedBack[key]).toEqual(solrArgs[key]);
    });
  });
});
