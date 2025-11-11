# Active Context: Splainer Search

## Current Work Focus
The project is currently in the initial phase of migrating from an AngularJS-based library to a plain JavaScript (ESM) library while preserving the public API. This involves:
- Analyzing the existing AngularJS codebase structure
- Planning the new ESM architecture
- Setting up the development environment and testing infrastructure
- Beginning implementation of core components

## Recent Changes
- Initial analysis of the AngularJS codebase
- Creation of the project plan document (`PLAN.md`)
- Setup of memory bank files for project documentation
- Preparation for the rewrite process

## Next Steps
1. Set up the development environment with pnpm, Vitest, eslint, and prettier
2. Create the basic project structure and build configuration
3. Begin implementing core domain objects (Doc, Searcher)
4. Implement transport mechanisms (HttpTransport, JsonpTransport)
5. Develop engine adapters (SolrAdapter, ESAdapter, etc.)
6. Create the public API factory
7. Add AngularJS compatibility wrapper
8. Write comprehensive tests and documentation

## Active Decisions and Considerations
- Maintaining backward compatibility with existing AngularJS consumers
- Choosing ESM as the primary module format for modern browser support
- Using Vitest for testing due to its speed and Jest compatibility
- Supporting both JSONP (for Solr parity) and HTTP transports
- Designing a clean API that abstracts engine differences while preserving functionality

## Important Patterns and Preferences
- Test-driven development approach with unit and integration tests
- Modular architecture with clear separation of concerns
- JSDoc for type documentation and IDE support
- Following the existing code patterns and conventions from the AngularJS version
- Maintaining the same public API surface for compatibility

## Learnings and Project Insights
- The AngularJS version had a complex but well-tested codebase
- The migration requires careful attention to API compatibility
- The existing test suite provides a good foundation for ensuring parity
- Multiple search engine support requires adapter pattern implementation
