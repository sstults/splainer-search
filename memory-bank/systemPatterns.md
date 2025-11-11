# System Patterns: Splainer Search

## System Architecture
The system follows a modular architecture pattern with clear separation of concerns:

1. **Core Domain Objects**: `Doc` and `Searcher` that provide the fundamental data structures and orchestration
2. **Adapter Pattern**: Engine adapters for different search engines (Solr, ES, Vectara, Custom API)
3. **Transport Layer**: HTTP and JSONP transports for network communication
4. **Public API**: Factory function that creates searchers with appropriate adapters
5. **Compatibility Layer**: Optional AngularJS wrapper for backward compatibility

## Key Technical Decisions
- **Module Format**: ES Modules (ESM) for modern browser support and Node.js compatibility
- **Testing Framework**: Vitest for fast, Jest-compatible testing
- **Build System**: tsup for generating both ESM and CJS builds
- **Error Handling**: Consistent error messages with clear explanations
- **API Design**: Abstracted engine differences while preserving functionality

## Design Patterns in Use
1. **Adapter Pattern**: Each search engine has its own adapter that implements the common interface
2. **Factory Pattern**: `createSearcher()` function that returns appropriate searcher based on engine
3. **Strategy Pattern**: Different transports (HTTP vs JSONP) for different scenarios
4. **Decorator Pattern**: Additional functionality like highlighting and explain can be added to documents
5. **Observer Pattern**: For handling asynchronous operations and callbacks

## Component Relationships
```
┌─────────────────┐    ┌─────────────────┐
│   Public API    │    │ Compatibility   │
│  (createSearcher)│───▶│   Wrapper       │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Searcher      │    │   AngularJS     │
│  (orchestration)│    │   Wrapper       │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  EngineAdapter  │    │   Transport     │
│  (abstract)     │    │   Layer         │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  SolrAdapter    │    │  HttpTransport  │
│  ESAdapter      │    │  JsonpTransport │
│  VectaraAdapter │    └─────────────────┘
│  CustomApiAdapter│
└─────────────────┘
```

## Critical Implementation Paths
1. **Core Domain Objects**: Start with `Doc` and `Searcher` implementations
2. **Transport Layer**: Implement HTTP and JSONP transports for network communication
3. **Engine Adapters**: Begin with SolrAdapter, then ESAdapter, etc.
4. **Public API**: Create the factory function that ties everything together
5. **Testing**: Write comprehensive unit and integration tests

## Data Flow
1. User calls `createSearcher()` with parameters
2. Factory determines engine type and creates appropriate adapter
3. Searcher orchestrates the query cycle using the adapter
4. Adapter delegates to transport layer for network communication
5. Response is parsed and normalized by adapter
6. Results are wrapped in `Doc` objects and returned to user
