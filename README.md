# Splainer Search

A framework-agnostic search library for Solr, Elasticsearch, OpenSearch, Vectara, and Search API integrations.

## Installation

```bash
pnpm install
```

When consuming the library from another project:

```bash
pnpm add splainer-search
```

## Usage

```js
import { createSearcher, search } from 'splainer-search';

// Preferred: create a searcher using the factory.
const searcher = createSearcher(
  null,
  'http://localhost:8983/solr/collection1',
  { rows: 10 },
  'example query',
  { searchEngine: 'solr' },
  'solr'
);

// Backward-compatible helper for a minimal config.
const legacySearcher = search(
  { url: 'http://localhost:9200/index' },
  'elasticsearch'
);

const result = await searcher.search();
console.log(result);
```

## Supported Engines

- Solr
- Elasticsearch / OpenSearch
- Vectara
- Algolia
- Search API

## Build & Test

```bash
pnpm run build
pnpm test
```

For more detailed development, build, and testing instructions, see
[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).

## Repository Structure

The canonical source lives under `src/`, including `src/core`, `src/adapters`,
`src/factories`, `src/services`, and `src/values`. The top-level `core/`,
`adapters/`, `factories/`, `services/`, `values/`, and `api/` folders remain as
thin re-export shims for backwards-compatible import paths.
