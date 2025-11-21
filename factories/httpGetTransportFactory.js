'use strict';

/**
 * HTTP GET Transport factory
 */
import { TransportFactory } from './transportFactory.js';
import { http } from '../utils/http.js';

export function HttpGetTransportFactory(TransportFactory, $http) {
  var Transport = function(options) {
    TransportFactory.call(this, options);
  };

  Transport.prototype = Object.create(TransportFactory.prototype);
  Transport.prototype.constructor = Transport;

  Transport.prototype.query = query;

  function query(url, payload, headers) {
    var requestConfig = { headers: headers };
    return http.get(url, requestConfig);
  }

  return Transport;
}
