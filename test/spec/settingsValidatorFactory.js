'use strict';

// Import required modules
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SettingsValidatorFactory } from '../../src/factories/settingsValidatorFactory.js';

// Mock data and utilities
const fullResponse = {
  'responseHeader': {
    'status': 0,
    'QTime': 0,
    'params': {
      'q': '*:*',
      'indent': 'on',
      'wt': 'json'
    }
  },
  'response': {
    'numFound': 20148,
    'start': 0,
    'docs': [
      {
        'id':'l_5552',
        'catch_line':'Hours of work.',
        'text':'For purposes of computing.',
        'section':'9.1-703',
        'structure':'Commonwealth Public Safety/Overtime Compensation for Law-Enforcement Employees and Firefighters, Emergency Medical Technicians,',
        'type':'law',
        '_version_':1512671587453632512
      },
      {
        'id':'l_20837',
        'catch_line':'Powers, duties and responsibilities of the Inspector.',
        'text':'foo',
        'section':'45.1-361.28',
        'structure':'Mines and Mining/The Virginia Gas and Oil Act',
        'tags':['locality'],
        'refers_to':['45.1-161.5'],
        'type':'law',
        '_version_':1512671587500818432
      }
    ]
  }
};

const funkyDocs = [
  {
    'id':'l_5552',
    'text':'For purposes of computing.',
    'section':'9.1-703',
    'structure':'Commonwealth Public Safety/Overtime Compensation for Law-Enforcement Employees and Firefighters, Emergency Medical Technicians,',
    'type':'law',
    'uid': '1234',
    '_version_':1512671587453632512
  },
  {
    'catch_line':'Powers, duties and responsibilities of the Inspector.',
    'text':'foo',
    'section':'45.1-361.28',
    'structure':'Mines and Mining/The Virginia Gas and Oil Act',
    'tags':['locality'],
    'refers_to':['45.1-161.5'],
    'type':'law',
    'uid': '1235',
    '_version_':1512671587500818432
  },
  {
    'id':'l_5552',
    'text':'For purposes of computing.',
    'section':'9.1-703',
    'uid': '1236',
    '_version_':1512671587453632512
  }
];

const esFullResponse = {
  hits: {
    hits: [
      {
        _score: 6.738184,
        _type:  'movie',
        _id:    'AU8pXbemwjf9yCj9Xh4e',
        _source: {
          title:        'Rambo',
          id:           5039,
          name:         'Rambo Collection'
        },
        _index: 'tmdb',
        highlight: {
          title: [
            '<em>Rambo</em>'
          ]
        }
      },
      {
        _score:   4.1909046,
        _type:    'movie',
        _id:      'AU8pXau9wjf9yCj9Xhug',
        _source: {
          poster_path:  '/cUJgu5U6MHj9GF1weNtIPvN3IoS.jpg',
          id:           1370,
          title:        'Rambo III'
        },
        _index: 'tmdb'
      }
    ],
    total:      2,
    max_score:  6.738184
  },
  _shards: {
    successful: 5,
    failed:     0,
    total:      5
  },
  took:       88,
  timed_out:  false
};

const searchApiResponse = [
  {
    'publication_id': '12345678',
    'publish_date_int': '20230601',
    'score': 0.5590707659721375,
    'title': 'INFOGRAPHIC: Automakers\' transition to EVs speeds up'
  },
  {
    'publication_id': '1234567',
    'publish_date_int': '20230608',
    'score': 0.5500463247299194,
    'title': 'Tesla - March 2023 (LTM): Peer Snapshot'
  },
  {
    'publication_id': '123456',
    'publish_date_int': '20230731',
    'score': 0.5492520928382874,
    'title': 'Tesla'
  },
  {
    'publication_id': '987654',
    'publish_date_int': '20230906',
    'score': 0.549148440361023,
    'title': 'Tesla Motor Company - June 2023 (LTM): Peer Snapshot'
  },
  {
    'publication_id': '765432',
    'publish_date_int': '20221201',
    'score': 0.5465325117111206,
    'title': 'Tesla Motor Company - September 2022 (LTM): Peer Snapshot'
  }
];

describe('Factory: Settings Validator', () => {
  let validator;
  let originalFetch;
  
  beforeEach(() => {
    // Mock fetch globally for HTTP requests
    originalFetch = global.fetch;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore fetch
    global.fetch = originalFetch;
  });

  describe('Solr:', () => {
    const settings = {
      searchUrl:    'http://solr.splainer-searcher.io/solr/statedecoded/select',
      searchEngine: 'solr'
    };

    beforeEach(() => {
      validator = new SettingsValidatorFactory()(settings);
    });

    describe('Generates candidate ids', () => {
      it('selects only ids occuring across all docs, bland docs', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(fullResponse)
        });

        await validator.validateUrl();
        
        expect(validator.idFields.length).toBe(7);
        expect(validator.idFields).toContain('id');
        expect(validator.idFields).toContain('text');
        expect(validator.idFields).toContain('catch_line');
        expect(validator.idFields).toContain('section');
        expect(validator.idFields).toContain('type');
        expect(validator.idFields).toContain('structure');
        expect(validator.idFields).toContain('_version_');
      });

      it('selects only ids occuring across all docs, funkier docs', async () => {
        const funkyResponse = JSON.parse(JSON.stringify(fullResponse)); // Deep copy
        funkyResponse.response.docs = funkyDocs;

        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(funkyResponse)
        });

        await validator.validateUrl();
        
        expect(validator.idFields.length).toBe(4);
        expect(validator.idFields).toContain('uid');
        expect(validator.idFields).toContain('text');
        expect(validator.idFields).toContain('section');
        expect(validator.idFields).toContain('_version_');
      });

      // This test was empty in the original - keeping it as is
      it('selects only ids occuring across all docs, funkier docs', async () => {
        // Empty test as in original
      });
    });

    describe('Validate URL:', () => {
      it('makes a successful call to the Solr instance', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(fullResponse)
        });

        await validator.validateUrl();
        // If we get here without error, the test passes
      });

      it('extracts the list of fields', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(fullResponse)
        });

        await validator.validateUrl();
        
        expect(validator.fields).toEqual([ 'id', 'catch_line', 'text', 'section', 'structure', 'type', '_version_', 'tags', 'refers_to' ]);
      });
      
      it('throws an error when you try to PROXY with JSONP to the Solr instance', () => {
        const proxySettings = {
          searchUrl:    'http://solr.splainer-searcher.io/solr/statedecoded/select',
          searchEngine: 'solr',
          apiMethod: 'GET',
          proxyUrl: 'http://myserver/proxy?proxy='
        };
        
        // Create a new validator with proxy settings
        const proxyValidator = new SettingsValidatorFactory()(proxySettings);
        
        // Since we're in a plain JS environment, we need to check the logic
        // The original Angular test expects an error to be thrown, but we need to
        // implement the actual validation logic in the factory to make this meaningful
        expect(() => {
          proxyValidator.validateUrl();
        }).toThrow('It does not make sense to proxy a JSONP connection, use GET instead.');
      });
      
      it('makes a successful PROXIED call to the Solr instance', async () => {
        const proxySettings = {
          searchUrl:    'http://solr.splainer-searcher.io/solr/statedecoded/select',
          searchEngine: 'solr',
          apiMethod: 'GET',
          proxyUrl: 'http://myserver/proxy?proxy='
        };
        
        const proxyValidator = new SettingsValidatorFactory()(proxySettings);
        
        // Mock fetch response for the proxied call
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(fullResponse)
        });

        await proxyValidator.validateUrl();
        // If we get here without error, the test passes
      });      
    });
  });

  describe('ES:', () => {
    const settings = {
      searchUrl:    'http://es.splainer-searcher.io/tmdb/_select',
      searchEngine: 'es'
    };

    beforeEach(() => {
      validator = new SettingsValidatorFactory()(settings);
    });

    describe('Generates candidate ids', () => {
      it('selects only ids occuring across all docs', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(esFullResponse)
        });

        await validator.validateUrl();
        
        expect(validator.idFields.length).toBe(3);
        expect(validator.idFields).toContain('id');
        expect(validator.idFields).toContain('_id');
        expect(validator.idFields).toContain('title');
      });
    });

    describe('Validate URL:', () => {
      it('makes a successful call to the ES instance', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(esFullResponse)
        });

        await validator.validateUrl();
        // If we get here without error, the test passes
      });

      it('extracts the list of fields', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(esFullResponse)
        });

        await validator.validateUrl();
        
        expect(validator.fields).toEqual(['_id', 'title', 'id', 'name', 'poster_path']);
      });
    });
  });
  
  describe('SearchApi:', () => {
    const settings = {
      searchUrl:    'http://mycompany/api/search',
      searchEngine: 'searchapi',
      args: 'query=tesla',
      apiMethod: 'GET'
    };
    
    settings.docsMapper = function(data){    
      let docs = [];
      for (let doc of data) {
        docs.push ({
          id: doc.publication_id,
          publish_date_int: doc.publish_date_int,
          title: doc.title,
        });
      }
      return docs;
    };

    beforeEach(() => {
      validator = new SettingsValidatorFactory()(settings);
    });

    describe('Generates candidate ids', () => {
      it('selects only ids occuring across all docs', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(searchApiResponse)
        });

        await validator.validateUrl();
        
        expect(validator.idFields.length).toBe(3);
        expect(validator.idFields).toContain('id');
        expect(validator.idFields).toContain('publish_date_int');
        expect(validator.idFields).toContain('title');
      });
    });
    
    describe('Tracks the last response from the search api', () => {
      it('selects only ids occuring across all docs', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(searchApiResponse)
        });

        await validator.validateUrl();
        
        expect(validator.searcher.lastResponse).toEqual(searchApiResponse);
      });
    });    

    describe('Validate URL:', () => {
      it('makes a successful call to the SearchApi instance', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(searchApiResponse)
        });

        await validator.validateUrl();
        // If we get here without error, the test passes
      });

      it('extracts the list of fields', async () => {
        // Mock fetch response
        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(searchApiResponse)
        });

        await validator.validateUrl();
        
        expect(validator.fields).toEqual(['id', 'publish_date_int', 'title']);
      });
    });
  });
});
