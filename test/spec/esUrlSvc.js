'use strict';

import { esUrlSvc } from '../../services/esUrlSvc.js';
import { isDefined } from '../../services/objectUtils.js';

// Create test suite for esUrlSvc
console.log('Running esUrlSvc tests...');

const esUrlService = new esUrlSvc();

// Test parseUrl function
console.log('Testing parseUrl...');
try {
  let url = 'http://localhost:9200/myindex/_search';
  let result = esUrlService.parseUrl(url);
  
  if (result.protocol === 'http:' && 
      result.host === 'localhost:9200' && 
      result.pathname === '/myindex/_search' && 
      result.username === '' && 
      result.password === '' && 
      result.query === '') {
    console.log('✓ parseUrl works correctly');
  } else {
    console.error('✗ parseUrl failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ parseUrl failed with error:', error);
}

// Test parseUrl function - missing protocol
console.log('Testing parseUrl with missing protocol...');
try {
  let url = 'localhost:9200/myindex/_search';
  let result = esUrlService.parseUrl(url);
  
  if (result.protocol === 'http:' && 
      result.host === 'localhost:9200' && 
      result.pathname === '/myindex/_search') {
    console.log('✓ parseUrl with missing protocol works correctly');
  } else {
    console.error('✗ parseUrl with missing protocol failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ parseUrl with missing protocol failed with error:', error);
}

// Test parseUrl function - https protocol
console.log('Testing parseUrl with https protocol...');
try {
  let url = 'https://localhost:9200/myindex/_search';
  let result = esUrlService.parseUrl(url);
  
  if (result.protocol === 'https:' && 
      result.host === 'localhost:9200' && 
      result.pathname === '/myindex/_search') {
    console.log('✓ parseUrl with https protocol works correctly');
  } else {
    console.error('✗ parseUrl with https protocol failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ parseUrl with https protocol failed with error:', error);
}

// Test parseUrl function - username and password
console.log('Testing parseUrl with username and password...');
try {
  let url = 'http://user:pass@localhost:9200/myindex/_search';
  let result = esUrlService.parseUrl(url);
  
  if (result.username === 'user' && 
      result.password === 'pass') {
    console.log('✓ parseUrl with username and password works correctly');
  } else {
    console.error('✗ parseUrl with username and password failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ parseUrl with username and password failed with error:', error);
}

// Test buildBaseUrl function
console.log('Testing buildBaseUrl...');
try {
  let uri = {
    protocol: 'http:',
    host: 'localhost:9200'
  };
  let result = esUrlService.buildBaseUrl(uri);
  
  if (result === 'http://localhost:9200') {
    console.log('✓ buildBaseUrl works correctly');
  } else {
    console.error('✗ buildBaseUrl failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ buildBaseUrl failed with error:', error);
}

// Test buildDocUrl function
console.log('Testing buildDocUrl...');
try {
  let uri = {
    protocol: 'http:',
    host: 'localhost:9200'
  };
  let doc = {
    _index: 'myindex',
    _type: 'mytype',
    _id: '123'
  };
  let result = esUrlService.buildDocUrl(uri, doc, false);
  
  if (result === 'http://localhost:9200/myindex/mytype/_doc/123?pretty=true') {
    console.log('✓ buildDocUrl works correctly');
  } else {
    console.error('✗ buildDocUrl failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ buildDocUrl failed with error:', error);
}

// Test buildDocUrl function - explain URL
console.log('Testing buildDocUrl with explain...');
try {
  let uri2 = {
    protocol: 'http:',
    host: 'localhost:9200'
  };
  let doc2 = {
    _index: 'myindex',
    _type: 'mytype',
    _id: '123'
  };
  let result2 = esUrlService.buildDocUrl(uri2, doc2, true);
  
  if (result2 === 'http://localhost:9200/myindex/_explain/123') {
    console.log('✓ buildDocUrl with explain works correctly');
  } else {
    console.error('✗ buildDocUrl with explain failed - incorrect result:', result2);
  }
} catch (error) {
  console.error('✗ buildDocUrl with explain failed with error:', error);
}

// Test buildExplainUrl function
console.log('Testing buildExplainUrl...');
try {
  var uri = {
    protocol: 'http:',
    host: 'localhost:9200'
  };
  var doc = {
    _index: 'myindex',
    _type: 'mytype',
    _id: '123'
  };
  var result = esUrlService.buildExplainUrl(uri, doc);
  
  if (result === 'http://localhost:9200/myindex/_explain/123') {
    console.log('✓ buildExplainUrl works correctly');
  } else {
    console.error('✗ buildExplainUrl failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ buildExplainUrl failed with error:', error);
}

// Test buildRenderTemplateUrl function
console.log('Testing buildRenderTemplateUrl...');
try {
  let uri = {
    protocol: 'http:',
    host: 'localhost:9200'
  };
  let result = esUrlService.buildRenderTemplateUrl(uri);
  
  if (result === 'http://localhost:9200/_render/template') {
    console.log('✓ buildRenderTemplateUrl works correctly');
  } else {
    console.error('✗ buildRenderTemplateUrl failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ buildRenderTemplateUrl failed with error:', error);
}

// Test buildUrl function
console.log('Testing buildUrl...');
try {
  let uri = {
    protocol: 'http:',
    host: 'localhost:9200',
    pathname: '/_search',
    params: {
      from: 10,
      size: 10
    }
  };
  let result = esUrlService.buildUrl(uri);
  
  if (result === 'http://localhost:9200/_search?from=10&size=10') {
    console.log('✓ buildUrl works correctly');
  } else {
    console.error('✗ buildUrl failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ buildUrl failed with error:', error);
}

// Test isBulkCall function
console.log('Testing isBulkCall...');
try {
  let uri = {
    pathname: '/_msearch'
  };
  let result = esUrlService.isBulkCall(uri);
  
  if (result === true) {
    console.log('✓ isBulkCall works correctly');
  } else {
    console.error('✗ isBulkCall failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ isBulkCall failed with error:', error);
}

// Test isBulkCall function - non-bulk call
console.log('Testing isBulkCall with non-bulk call...');
try {
  let uri = {
    pathname: '/_search'
  };
  let result = esUrlService.isBulkCall(uri);
  
  if (result === false) {
    console.log('✓ isBulkCall with non-bulk call works correctly');
  } else {
    console.error('✗ isBulkCall with non-bulk call failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ isBulkCall with non-bulk call failed with error:', error);
}

// Test isTemplateCall function
console.log('Testing isTemplateCall...');
try {
  let args = {
    id: 'my-template-id'
  };
  let result = esUrlService.isTemplateCall(args);
  
  if (result === true) {
    console.log('✓ isTemplateCall works correctly');
  } else {
    console.error('✗ isTemplateCall failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ isTemplateCall failed with error:', error);
}

// Test isTemplateCall function - non-template call
console.log('Testing isTemplateCall with non-template call...');
try {
  let args = {
    query: 'my-query'
  };
  let result = esUrlService.isTemplateCall(args);
  
  if (result === false) {
    console.log('✓ isTemplateCall with non-template call works correctly');
  } else {
    console.error('✗ isTemplateCall with non-template call failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ isTemplateCall with non-template call failed with error:', error);
}

// Test stripBasicAuth function
console.log('Testing stripBasicAuth...');
try {
  let url = 'http://user:pass@localhost:9200/myindex/_search';
  let result = esUrlService.stripBasicAuth(url);
  
  if (result === 'http://localhost:9200/myindex/_search') {
    console.log('✓ stripBasicAuth works correctly');
  } else {
    console.error('✗ stripBasicAuth failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ stripBasicAuth failed with error:', error);
}

// Test getHeaders function - custom headers
console.log('Testing getHeaders with custom headers...');
try {
  let uri = {
    username: 'user',
    password: 'pass'
  };
  let customHeaders = '{"Content-Type": "application/json"}';
  let result = esUrlService.getHeaders(uri, customHeaders);
  
  if (result['Content-Type'] === 'application/json') {
    console.log('✓ getHeaders with custom headers works correctly');
  } else {
    console.error('✗ getHeaders with custom headers failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ getHeaders with custom headers failed with error:', error);
}

// Test getHeaders function - basic auth headers
console.log('Testing getHeaders with basic auth headers...');
try {
  let uri = {
    username: 'user',
    password: 'pass'
  };
  let result = esUrlService.getHeaders(uri, '');
  
  if (result['Authorization'] && result['Authorization'].startsWith('Basic ')) {
    console.log('✓ getHeaders with basic auth headers works correctly');
  } else {
    console.error('✗ getHeaders with basic auth headers failed - incorrect result:', result);
  }
} catch (error) {
  console.error('✗ getHeaders with basic auth headers failed with error:', error);
}

console.log('All esUrlSvc tests completed.');
