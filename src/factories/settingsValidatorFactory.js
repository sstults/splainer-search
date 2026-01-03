'use strict';

/**
 * Settings Validator factory
 */
import { createSearcher } from '../api/index.js';

export function SettingsValidatorFactory(fieldSpecSvc, searchSvc) {
  var Validator = function(settings) {
    var self  = this;

    self.searchUrl      = settings.searchUrl;
    self.searchEngine   = settings.searchEngine;
    self.apiMethod      = settings.apiMethod;
    self.version        = settings.version;
    self.customHeaders  = settings.customHeaders;

    // we shouldn't unpack and set these settings to local variables (like above!)
    // because sometimes we don't know what they are all.  For example
    // for the searchapi we need to pass a bunch of extra settings through
    // to the searcher
    self.settings       = settings;

    if (settings.args){
      self.args = settings.args;
    }

    self.searcher = null;
    self.fields   = [];
    self.idFields = [];

    self.setupSearcher  = setupSearcher;
    self.validateUrl    = validateUrl;

    self.setupSearcher();

    function setupSearcher () {
      var args    = { };
      var fields  = '*';

      // Did we pass in some args externally that we want to use instead
      if (self.args) {
        args = self.args;
      }

      if ( self.searchEngine === 'solr' ) {
        args = { q: ['*:*'] };
      } else if ( self.searchEngine === 'es' || self.searchEngine === 'os' ) {
        args = { query: { match_all: {} } };
      } else if ( self.searchEngine === 'algolia' ) {
        args = { query: '' };
      } else if ( self.searchEngine === 'vectara' ) {
        args = { query: '' };
      } else if ( self.searchEngine === 'searchapi' ) {
        args = { query: '' };
      }

      // Call the factory function with the correct parameters
      self.searcher = createSearcher(
        null,
        self.searchUrl,
        args,
        '',
        self.settings,
        self.searchEngine
      );
    }

    function validateUrl () {
      // This is a placeholder - in Angular this would make an HTTP request
      // In plain JavaScript, we'd need to implement the actual validation logic
      return new Promise(function(resolve, reject) {
        resolve(true);
      });
    }
  };

  // Return factory object
  return Validator;
}
