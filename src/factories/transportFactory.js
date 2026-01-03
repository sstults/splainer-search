'use strict';

/**
 * Base Transport factory for creating transport objects
 */
export function TransportFactory() {
  var Transporter = function(opts) {
    var self = this;

    self.options = options;

    function options() {
      return opts;
    }
  };

  // Return factory object
  return Transporter;
}
