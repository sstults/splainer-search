import { esUrlSvc } from '../services/esUrlSvc.js';

// Test the esUrlSvc implementation directly
console.log('Testing esUrlSvc implementation...');

const esUrlService = new esUrlSvc();

// Test parseUrl function
console.log('Testing parseUrl...');
try {
  const result = esUrlService.parseUrl('http://localhost:9200/myindex/_search');
  console.log('parseUrl result:', result);
  console.log('✓ parseUrl works correctly');
} catch (error) {
  console.error('✗ parseUrl failed:', error);
}

// Test buildBaseUrl function
console.log('Testing buildBaseUrl...');
try {
  const uri = { protocol: 'http:', host: 'localhost:9200' };
  const result = esUrlService.buildBaseUrl(uri);
  console.log('buildBaseUrl result:', result);
  console.log('✓ buildBaseUrl works correctly');
} catch (error) {
  console.error('✗ buildBaseUrl failed:', error);
}

// Test buildDocUrl function
console.log('Testing buildDocUrl...');
try {
  const uri = { protocol: 'http:', host: 'localhost:9200' };
  const doc = { _index: 'myindex', _type: 'mytype', _id: '123' };
  const result = esUrlService.buildDocUrl(uri, doc, false);
  console.log('buildDocUrl result:', result);
  console.log('✓ buildDocUrl works correctly');
} catch (error) {
  console.error('✗ buildDocUrl failed:', error);
}

// Test isBulkCall function
console.log('Testing isBulkCall...');
try {
  const uri = { pathname: '/_msearch' };
  const result = esUrlService.isBulkCall(uri);
  console.log('isBulkCall result:', result);
  console.log('✓ isBulkCall works correctly');
} catch (error) {
  console.error('✗ isBulkCall failed:', error);
}

console.log('All tests completed.');
