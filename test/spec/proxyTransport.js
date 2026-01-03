'use strict';

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpProxyTransportFactory } from '../../src/factories/httpProxyTransportFactory.js';
import { TransportFactory } from '../../src/factories/transportFactory.js';

describe('HttpProxyTransportFactory', () => {
  let ProxyTransport;
  let BaseTransport;

  class FakeJsonpTransport {}

  beforeEach(() => {
    BaseTransport = TransportFactory();
    ProxyTransport = HttpProxyTransportFactory(BaseTransport, FakeJsonpTransport);
  });

  it('proxies requests by prefixing the proxy url', () => {
    const innerTransport = { query: vi.fn() };
    const transport = new ProxyTransport({
      proxyUrl: 'http://localhost/proxy/',
      transport: innerTransport
    });

    const url = 'http://example.com/search';
    const payload = { test: 1 };
    const headers = { header: 1 };

    transport.query(url, payload, headers);

    expect(innerTransport.query).toHaveBeenCalledWith(
      'http://localhost/proxy/' + url,
      payload,
      headers
    );
  });

  it('throws when proxying a JSONP transport', () => {
    const innerTransport = new FakeJsonpTransport();
    const transport = new ProxyTransport({
      proxyUrl: 'http://localhost/proxy/',
      transport: innerTransport
    });

    expect(() => transport.query('http://example.com', {}, {})).toThrow(
      'It does not make sense to proxy a JSONP connection, use GET instead.'
    );
  });
});
