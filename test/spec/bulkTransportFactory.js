import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bulkTransportFactory } from '../../src/factories/bulkTransportFactory.js';

describe('bulkTransportFactory', () => {
  let transport;
  let bulkTransport;

  beforeEach(() => {
    transport = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      jsonp: vi.fn(),
      query: vi.fn()
    };

    bulkTransport = new bulkTransportFactory()(transport);
  });

  it('creates a bulk transport object', () => {
    expect(bulkTransport).toBeDefined();
    expect(bulkTransport.bulk).toBeDefined();
  });

  it('rejects when operations is not an array', async () => {
    await expect(bulkTransport.bulk('not an array')).rejects.toThrow(
      'Operations must be an array'
    );
  });

  it('rejects when an operation does not have a url', async () => {
    await expect(bulkTransport.bulk([{ method: 'GET' }])).rejects.toThrow(
      'Each operation must have a url'
    );
  });

  it('handles GET operations', async () => {
    transport.get.mockResolvedValue({ data: 'get result' });

    const results = await bulkTransport.bulk([
      { url: '/api/test1', method: 'GET' },
      { url: '/api/test2', method: 'GET' }
    ]);

    expect(transport.get).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(2);
  });

  it('handles POST operations', async () => {
    transport.post.mockResolvedValue({ data: 'post result' });

    const results = await bulkTransport.bulk([
      { url: '/api/test1', method: 'POST', payload: { key: 'value' } },
      { url: '/api/test2', method: 'POST', payload: { key: 'value2' } }
    ]);

    expect(transport.post).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(2);
  });

  it('handles PUT operations', async () => {
    transport.put.mockResolvedValue({ data: 'put result' });

    const results = await bulkTransport.bulk([
      { url: '/api/test1', method: 'PUT', payload: { key: 'value' } },
      { url: '/api/test2', method: 'PUT', payload: { key: 'value2' } }
    ]);

    expect(transport.put).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(2);
  });

  it('handles DELETE operations', async () => {
    transport.delete.mockResolvedValue({ data: 'delete result' });

    const results = await bulkTransport.bulk([
      { url: '/api/test1', method: 'DELETE' },
      { url: '/api/test2', method: 'DELETE' }
    ]);

    expect(transport.delete).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(2);
  });

  it('handles JSONP operations', async () => {
    transport.jsonp.mockResolvedValue({ data: 'jsonp result' });

    const results = await bulkTransport.bulk([
      { url: '/api/test1', method: 'JSONP' },
      { url: '/api/test2', method: 'JSONP' }
    ]);

    expect(transport.jsonp).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(2);
  });

  it('handles unknown operations with query method', async () => {
    transport.query.mockResolvedValue({ data: 'query result' });

    const results = await bulkTransport.bulk([
      { url: '/api/test1', method: 'UNKNOWN' },
      { url: '/api/test2', method: 'UNKNOWN' }
    ]);

    expect(transport.query).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(2);
  });

  it('handles operations with headers', async () => {
    transport.get.mockResolvedValue({ data: 'get result' });

    const results = await bulkTransport.bulk([
      { url: '/api/test1', method: 'GET', headers: { Authorization: 'Bearer token1' } },
      { url: '/api/test2', method: 'GET', headers: { Authorization: 'Bearer token2' } }
    ]);

    expect(transport.get).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(2);
  });

  it('handles mixed operation types', async () => {
    transport.get.mockResolvedValue({ data: 'get result' });
    transport.post.mockResolvedValue({ data: 'post result' });

    const results = await bulkTransport.bulk([
      { url: '/api/test1', method: 'GET' },
      { url: '/api/test2', method: 'POST', payload: { key: 'value' } }
    ]);

    expect(transport.get).toHaveBeenCalledTimes(1);
    expect(transport.post).toHaveBeenCalledTimes(1);
    expect(results).toHaveLength(2);
  });
});
