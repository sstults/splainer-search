'use strict';

/**
 * Vectara Doc factory
 */
import { DocFactory } from './docFactory.js';

export function VectaraDocFactory(vectaraUrlSvc, DocFactory) {
  const Doc = function(doc, options) {
    DocFactory.call(this, doc, options);

    const self = this;

    const fields = self.fieldsProperty();
    for (const fieldName in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, fieldName)) {
        const fieldValue = fields[fieldName];
        if (fieldValue !== null && Array.isArray(fieldValue) && fieldValue.length === 1) {
          self[fieldName] = fieldValue[0];
        } else {
          self[fieldName] = fieldValue;
        }
      }
    }
  };

  Doc.prototype = Object.create(DocFactory.prototype);
  Doc.prototype.constructor = Doc; // Reset the constructor
  Doc.prototype._url           = _url;
  Doc.prototype.origin         = origin;
  Doc.prototype.fieldsProperty = fieldsProperty;
  Doc.prototype.explain        = explain;
  Doc.prototype.snippet        = snippet;
  Doc.prototype.highlight      = highlight;

  function _url () {
    return 'unavailable';
  }

  function origin () {
    /*jslint validthis:true*/
    var self = this;

    var src = {};
    for (var field in self) {
      if (Object.prototype.hasOwnProperty.call(self, field) && typeof self[field] !== 'function') {
        src[field] = self[field];
      }
    }
    delete src.doc;
    delete src.metadata;
    delete src.opts;
    return src;
  }

  function fieldsProperty() {
    /*jslint validthis:true*/
    const self = this;
    const metadata = self.metadata;
    return metadata.reduce(function(map, obj) {
      map[obj.name] = obj.value;
      return map;
    }, {});
  }

  function explain () {
    // no explain functionality implemented
    return {};
  }

  function snippet () {
    // no snippet functionality implemented
    return null;
  }

  function highlight () {
    // no highlighting functionality implemented
    return null;
  }

  return Doc;
}
