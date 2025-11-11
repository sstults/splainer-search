# Product Context: Splainer Search

## Why This Project Exists
Splainer Search exists to provide diagnostic capabilities for search relevance tuning. It's used by tools like Quepid and Splainer to help users understand how their search engines are ranking results and to identify opportunities for improving search quality.

## Problems This Project Solves
- Search relevance tuning is difficult without proper diagnostic tools
- Different search engines (Solr, Elasticsearch, etc.) have different APIs and response formats
- Users need to understand why certain documents are ranked higher than others
- Highlighting and explain functionality is crucial for relevance analysis
- Consistent API across different search engines is needed for tooling

## How It Should Work
The library provides a consistent API for performing search operations against different search engines. Users can:
1. Create a searcher for a specific engine (Solr, ES, etc.)
2. Perform searches with query parameters
3. Access highlighted snippets and explain information
4. Navigate through paginated results
5. Access document source data

## User Experience Goals
- Simple, consistent API that works across different search engines
- Clear error messages and debugging information
- Good performance with proper resource management
- Backward compatibility with existing AngularJS consumers
- Comprehensive documentation and examples
