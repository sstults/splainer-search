'use strict';

/**
 * HTTP JSONP Transport factory
 */
import { TransportFactory } from './transportFactory.js';
import { http } from '../../utils/http.js';

export function HttpJsonpTransportFactory(TransportFactory, $http, $sce) {
  var Transport = function(options) {
    TransportFactory.call(this, options);
  };

  Transport.prototype = Object.create(TransportFactory.prototype);
  Transport.prototype.constructor = Transport;

  Transport.prototype.query = query;

  function query(url, payload, headers) {
    
    // JSONP doesn't support headers, so we need to encode the user password in the URL. 
    // Special characters need to be encoded. 
    if (headers && headers['Authorization']) {
      let userPassword = headers['Authorization'];
      userPassword = userPassword.replace('Basic ', '');
      userPassword = atob(userPassword);
      userPassword = userPassword.split(':');
      userPassword = userPassword[0] + ':' + encodeURIComponent(userPassword[1]);

      url = url.replace('://', '://' + userPassword + '@');
    }
    
    // In plain JavaScript, we don't have $sce.trustAsResourceUrl, so we'll just use the URL directly
    // The JSONP functionality would need to be implemented with a different approach
    // you don't get header or payload support with jsonp, it's akin to GET requests that way.
    return http.jsonp(url, { jsonpCallbackParam: 'json.wrf' });
  }

  return Transport;
}
