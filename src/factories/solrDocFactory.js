'use strict';

/*jslint latedef:false*/
import { Doc } from '../core/Doc.js';
import { solrUrlSvc } from '../services/solrUrlSvc.js';
import { copyObject } from '../services/objectUtils.js';

export function SolrDocFactory() {
  const DocFactory = function(doc, options) {
    // Call the parent constructor
    Doc.call(this, { source: doc, highlight: options.highlight, explain: options.explain });
    
    // Store options for later use
    this._options = options;
  };

  // Inherit from Doc
  DocFactory.prototype = Object.create(Doc.prototype);
  DocFactory.prototype.constructor = DocFactory; // Reset the constructor

  // Add methods to the prototype
  DocFactory.prototype._url = _url;
  DocFactory.prototype.explain = explain;
  DocFactory.prototype.snippet = snippet;
  DocFactory.prototype.origin = origin;
  DocFactory.prototype.highlight = highlight;

  var entityMap = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    '\'': '&#39;',
    '/': '&#x2F;'
  };

  var escapeHtml = function(string) {
    return String(string).replace(/[&<>"'/]/g, function (s) {
      return entityMap[s];
    });
  };

  /**
   *
   * Builds Solr URL for a single Solr document.
   */
  var buildDocUrl = function(fieldList, url, idField, docId) {
    // SUSS_USE_OF_ESCAPING.  Going to disable this and see what happens.
    //var escId = encodeURIComponent(solrUrlSvc.escapeUserQuery(docId));
    var escId = encodeURIComponent(docId);

    var urlArgs = {
      'indent': ['true'],
      'wt': ['json']
    };
    return solrUrlSvc().buildUrl(url, urlArgs) + '&q=' + idField + ':'  + escId;
  };

  function _url (idField, docId) {
    /*jslint validthis:true*/
    var self = this;
    return buildDocUrl(self._options.fieldList, self._options.url, idField, docId);
  }

  function explain (docId) {
    /*jslint validthis:true*/
    var self = this;

    if (Object.prototype.hasOwnProperty.call(self._options.explDict, docId)) {
      return self._options.explDict[docId];
    } else {
      return null;
    }
  }

  function snippet (docId, fieldName) {
    /*jslint validthis:true*/
    var self = this;

    if (Object.prototype.hasOwnProperty.call(self._options.hlDict, docId)) {
      var docHls = self._options.hlDict[docId];
      if (Object.prototype.hasOwnProperty.call(docHls, fieldName)) {
        return docHls[fieldName];
      }
    }
    return null;
  }

  function origin () {
    /*jslint validthis:true*/
    var self = this;
    return copyObject(self.source());
  }

  function highlight (docId, fieldName, preText, postText) {
    /*jslint validthis:true*/
    var self = this;
    var fieldValue = self.snippet(docId, fieldName);
    var escapedValue;
    var preRegex;
    var highlightedPre;
    var postRegex;
    var highlightedPost;

    if (fieldValue && fieldValue instanceof Array) {
      if ( fieldValue.length === 0 ) {
        return null;
      }

      var escapedValues = [];

      for (var i = 0; i < fieldValue.length; i++) {
        var value = fieldValue[i];
        escapedValue = escapeHtml(value);
        preRegex = new RegExp(self._options.highlightingPre, 'g');
        highlightedPre = escapedValue.replace(preRegex, preText);
        postRegex = new RegExp(self._options.highlightingPost, 'g');
        highlightedPost = highlightedPre.replace(postRegex, postText);

        escapedValues.push(highlightedPost);
      }

      return escapedValues;
    } else if (fieldValue) {
      escapedValue = escapeHtml(fieldValue);
      preRegex = new RegExp(self._options.highlightingPre, 'g');
      highlightedPre = escapedValue.replace(preRegex, preText);
      postRegex = new RegExp(self._options.highlightingPost, 'g');
      highlightedPost = highlightedPre.replace(postRegex, postText);

      return highlightedPost;
    } else {
      return null;
    }
  }

  return DocFactory;
}
