'use strict';

import { solrUrlSvc } from '../../services/solrUrlSvc.js';

// Test the solrUrlSvc implementation directly
console.log('Testing solrUrlSvc implementation...');

const solrUrlService = new solrUrlSvc();

// Test parseSolrArgs function
console.log('Testing parseSolrArgs...');
try {
  const argStr = 'q=1234&q=5678&fq=cat:foo';
  const parsedArgs = solrUrlService.parseSolrArgs(argStr);

  if (parsedArgs.q.includes('1234') && parsedArgs.q.includes('5678') && parsedArgs.q.length === 2 && parsedArgs.fq.includes('cat:foo') && parsedArgs.fq.length === 1) {
    console.log('✓ parseSolrArgs works correctly');
  } else {
    console.error('✗ parseSolrArgs failed - incorrect result:', parsedArgs);
  }
} catch (error) {
  console.error('✗ parseSolrArgs failed with error:', error);
}

// Test parseSolrArgs with urlencoded values
console.log('Testing parseSolrArgs with urlencoded values...');
try {
  const argStr = 'q=1234%20foo&q=5678&fq=cat:foo';
  const parsedArgs = solrUrlService.parseSolrArgs(argStr);

  if (parsedArgs.q.includes('1234 foo')) {
    console.log('✓ parseSolrArgs with urlencoded values works correctly');
  } else {
    console.error('✗ parseSolrArgs with urlencoded values failed - incorrect result:', parsedArgs);
  }
} catch (error) {
  console.error('✗ parseSolrArgs with urlencoded values failed with error:', error);
}

// Test parseSolrUrl function
console.log('Testing parseSolrUrl...');
try {
  const urlStr = 'http://localhost:8983/solr/collection1/select?q=*:*';
  const parsedSolrUrl = solrUrlService.parseSolrUrl(urlStr);

  if (parsedSolrUrl.protocol === 'http:' && 
      parsedSolrUrl.host === 'localhost:8983' && 
      parsedSolrUrl.collectionName === 'collection1' && 
      parsedSolrUrl.requestHandler === 'select' && 
      parsedSolrUrl.solrArgs.q.includes('*:*')) {
    console.log('✓ parseSolrUrl works correctly');
  } else {
    console.error('✗ parseSolrUrl failed - incorrect result:', parsedSolrUrl);
  }
} catch (error) {
  console.error('✗ parseSolrUrl failed with error:', error);
}

// Test parseSolrUrl with missing protocol
console.log('Testing parseSolrUrl with missing protocol...');
try {
  const urlStr = 'localhost:8983/solr/collection1/select?q=*:*';
  const parsedSolrUrl = solrUrlService.parseSolrUrl(urlStr);

  if (parsedSolrUrl.protocol === 'http:' && 
      parsedSolrUrl.host === 'localhost:8983' && 
      parsedSolrUrl.collectionName === 'collection1' && 
      parsedSolrUrl.requestHandler === 'select' && 
      parsedSolrUrl.solrArgs.q.includes('*:*')) {
    console.log('✓ parseSolrUrl with missing protocol works correctly');
  } else {
    console.error('✗ parseSolrUrl with missing protocol failed - incorrect result:', parsedSolrUrl);
  }
} catch (error) {
  console.error('✗ parseSolrUrl with missing protocol failed with error:', error);
}

// Test buildUrl function
console.log('Testing buildUrl...');
try {
  const url = solrUrlService.buildUrl('www.example.com', {a: 'b', c: 'd'});
  if (url === 'http://www.example.com?a=b&c=d') {
    console.log('✓ buildUrl works correctly');
  } else {
    console.error('✗ buildUrl failed - incorrect result:', url);
  }
} catch (error) {
  console.error('✗ buildUrl failed with error:', error);
}

// Test buildUrl with array values
console.log('Testing buildUrl with array values...');
try {
  const url = solrUrlService.buildUrl('www.example.com', {a: ['b', 'b'], c: 'd'});
  if (url === 'http://www.example.com?a=b&a=b&c=d') {
    console.log('✓ buildUrl with array values works correctly');
  } else {
    console.error('✗ buildUrl with array values failed - incorrect result:', url);
  }
} catch (error) {
  console.error('✗ buildUrl with array values failed with error:', error);
}

// Test escapeUserQuery function
console.log('Testing escapeUserQuery...');
try {
  const escaped = solrUrlService.escapeUserQuery('+-&!()[]{}^"~?:\\');
  if (escaped === '\\+\\-\\&\\!\\(\\)\\[\\]\\{\\}\\^\\"\\~\\?\\:\\\\') {
    console.log('✓ escapeUserQuery works correctly');
  } else {
    console.error('✗ escapeUserQuery failed - incorrect result:', escaped);
  }
} catch (error) {
  console.error('✗ escapeUserQuery failed with error:', error);
}

// Test formatSolrArgs and parseSolrArgs together
console.log('Testing formatSolrArgs and parseSolrArgs together...');
try {
  const solrArgs = {q: ['*:*'], fq: ['title:bar', 'text:foo']};
  const formatted = solrUrlService.formatSolrArgs(solrArgs);
  const parsedBack = solrUrlService.parseSolrArgs(formatted);
  
  let argsEqual = true;
  for (const key in solrArgs) {
    if (!(key in parsedBack) || !Array.isArray(parsedBack[key])) {
      argsEqual = false;
      break;
    }
    if (solrArgs[key].length !== parsedBack[key].length) {
      argsEqual = false;
      break;
    }
    for (let i = 0; i < solrArgs[key].length; i++) {
      if (solrArgs[key][i] !== parsedBack[key][i]) {
        argsEqual = false;
        break;
      }
    }
    if (!argsEqual) break;
  }
  
  if (argsEqual) {
    console.log('✓ formatSolrArgs and parseSolrArgs work correctly together');
  } else {
    console.error('✗ formatSolrArgs and parseSolrArgs failed - incorrect result:', parsedBack);
  }
} catch (error) {
  console.error('✗ formatSolrArgs and parseSolrArgs failed with error:', error);
}

console.log('All solrUrlSvc tests completed.');
