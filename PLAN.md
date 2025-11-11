# Goal
Rewrite the **AngularJS**-based `splainer-search` library to **plain JavaScript (ESM)** while preserving (and where useful, rationalizing) the public API. Deliver a battle‑tested, framework‑agnostic package usable from Node and modern browsers, with optional AngularJS compatibility wrapper for consumers that haven’t migrated yet.

This plan is optimized for a **local coding agent (Cline) with limited planning**: every task is small, test-first, and sequenced. Treat each checkbox as a single agent run. Keep commits tiny.

---

## Ground truth of current functionality (from repo README)
- Supports **Solr** (via JSONP), **Elasticsearch/OpenSearch** (via HTTP/CORS), experimental **Vectara**, and an experimental **Custom Search API** with result mappers. It exposes a `searchSvc.createSearcher(fields, url, params, options?, engine?)` that returns a `searcher` with `.search()`, `.docs`, `.pager()`, doc highlighting, and explain access. Paging is performed by creating a follow‑on `searcher` with `.pager()`. Vectara integration does **not** support explain. Custom API requires `numberOfResultsMapper` and `docsMapper` in options.

> These bullets are the acceptance criteria for parity.

---

## Target architecture (plain JS)
**Packages/Modules** (ESM + types via JSDoc or TypeScript d.ts):

1) `core/Searcher.js`
   - Orchestrates a query cycle.
   - Holds `docs`, `facets` (future), `total`, `timings`, and creates `.pager()`.
   - Delegates to an **EngineAdapter** and normalizes results to **Doc** objects.

2) `core/Doc.js`
   - Wraps a raw hit; exposes:
     - `source()` → normalized source map
     - `highlight(id, field, pre, post)`
     - `explain(id)` (if available)

3) `adapters/EngineAdapter.js` (abstract)
   - `search({ url, fields, params, options, pageState }): Promise<EngineResponse>`
   - Returns `{ total, docs, highlights?, explain?, nextPageState? }`

4) Concrete adapters
   - `adapters/SolrAdapter.js` (supports **JSONP** and **HTTP** transports)
   - `adapters/ESAdapter.js` (covers **Elasticsearch** and **OpenSearch**)
   - `adapters/VectaraAdapter.js` (no explain; documents limitation)
   - `adapters/CustomApiAdapter.js` (pluggable mappers)

5) `net/transport/*`
   - `HttpTransport` (fetch)
   - `JsonpTransport` (script tag injection with timeout & cancel)

6) `util/ExplainParser/*`
   - Pluggable explain parsers per engine (start with passthrough; expand later)

7) `api/index.js`
   - Public factory `createSearcher(fields, url, params, options={}, engine=null)` → `Searcher` (engine inferred from URL if `engine` omitted).

8) **Optional** `compat/angular/splainerSearch.module.js`
   - Tiny AngularJS wrapper that proxies to the new ESM API for drop‑in adoption.

9) `types/` (optional d.ts) to assist TS consumers.

---

## Project scaffolding
- Package format: ESM build with `tsup` or `vite` (even for JS) producing:
  - `dist/index.esm.js`, `dist/index.cjs`, and `types/`.
- Test runner: **Vitest** (fast, Jest‑compatible). Browser‑like env via `jsdom`.
- HTTP mocking: **nock** (Node) and a minimal JSONP simulator.
- Linting/format: `eslint`, `prettier` (fix on save).
- CI: `pnpm test`, `pnpm build` on push.

---

## Public API parity (spec)
- `createSearcher(fields, url, params, options={}, engine?)` → returns `searcher`.
- `searcher.search()` → Promise<void>; populates `searcher.docs` (array of `Doc`).
- `searcher.pager()` → returns a **new** searcher set to next page.
- `Doc#source()`, `Doc#highlight(id, field, pre, post)`, `Doc#explain(id)`.
- Engines: `solr`, `es` (Elasticsearch/OpenSearch), `vectara`, `searchapi` (custom).

---

## TDD Roadmap (phases & tasks)
Each task is **red → green → refactor**. Keep commits small. Suggested order:

### Phase 0 — Bootstrapping (infra)
- [ ] Init repo structure (see file tree below)
- [ ] Add pnpm, Vitest, eslint, prettier
- [ ] Configure CI workflow

**Tests to write:**
- [ ] Sanity test: imports `createSearcher` from `api/index.js`
- [ ] Lint runs clean on a sample file

### Phase 1 — Core domain (no networking)
1. **Doc model**
   - [ ] Implement `Doc` with `source()`
   - [ ] Implement `highlight(id, field, pre, post)` returning rendered string or array
   - [ ] Implement `explain(id)` (default: throws NotSupported if adapter did not supply)

   **Unit tests:**
   - [ ] Construct `Doc({ _source: {...}, highlight: {...}, explain: {...} })` → `source()` returns exactly the normalized map
   - [ ] `highlight()` returns empty when absent
   - [ ] `explain()` returns structured info when provided; throws otherwise

2. **EngineAdapter base**
   - [ ] Define interface & default error messages
   - [ ] Test that concrete adapters must implement `search()`

3. **Searcher orchestration** (no adapter)
   - [ ] Searcher accepts injected adapter; defers search call; builds `Doc` objects; keeps `total` & `pageState`
   - [ ] `pager()` preserves query/params and uses `nextPageState`

   **Unit tests:**
   - [ ] Searcher uses stub adapter to convert two fake docs to `Doc`
   - [ ] `pager()` returns a new instance with updated `pageState`

### Phase 2 — Transports
1. **HttpTransport**
   - [ ] Minimal `fetch` wrapper with timeout & headers
   - [ ] Test: success, non‑200, timeout

2. **JsonpTransport**
   - [ ] Create `<script>` injection with callback registry & timeout
   - [ ] Test: invokes callback with payload; cleans up script/registry; handles timeout

### Phase 3 — Adapters
1. **SolrAdapter** (supports JSONP and HTTP)
   - Behavior from README: JSONP recommended historically; fields prefixed with `hl:` request highlighting; explain keyed by doc id.
   - [ ] Map fields & construct `q/fq/start/rows` and `hl.fl`
   - [ ] Parse Solr response → `{ total, docs, highlights, explain, nextPageState }`
   - [ ] Support `options.transport = 'jsonp'|'http'` (default: http if CORS OK; else jsonp)

   **Tests:**
   - [ ] Builds URL/params correctly for basic query
   - [ ] Parses `response.docs`, `highlighting`, `debug.explain`
   - [ ] `pager()` increments `start`

2. **ESAdapter** (Elasticsearch & OpenSearch)
   - Behavior from README: same API; send Query DSL JSON body; fields mapping (`id:_id`).
   - [ ] POST JSON body to `/_search`
   - [ ] Normalize hits to Doc ( `_source`, `highlight`, `_explanation?` )
   - [ ] `nextPageState` via `from/size` or `search_after` (prefer `from/size` for parity)

   **Tests:**
   - [ ] Serializes DSL body and parses `hits.total`, `hits.hits`
   - [ ] Maps `_id` with `id:_id` in fields
   - [ ] Paginates with `from` offset

3. **VectaraAdapter** (experimental)
   - Behavior from README: accepts Vectara JSON, custom auth headers, **no explain**.
   - [ ] Respect `options.customHeaders`
   - [ ] Normalize results array to Docs with `score`, etc.
   - [ ] `explain()` must throw NotSupported

   **Tests:**
   - [ ] Sends headers; parses number of results and docs
   - [ ] `Doc#explain()` throws

4. **CustomApiAdapter**
   - Behavior from README: requires `numberOfResultsMapper(data)` and `docsMapper(data)`.
   - [ ] Validate mappers exist
   - [ ] Use mappers to build `{ total, docs }`

   **Tests:**
   - [ ] Missing mapper throws helpful error
   - [ ] Example JSON mapped to two docs

### Phase 4 — Public API factory
- [ ] `createSearcher(fields, url, params, options={}, engine?)`
- [ ] Engine inference by URL pattern if `engine` missing (`/solr/`, `/_search`, `vectara.io`, fallback: `searchapi`)
- [ ] Field mapping parser (`['id', 'title', 'hl:body', 'author']` & `['id:_id', ...]`)
- [ ] Returns `Searcher` wired with correct adapter

**Tests:**
- [ ] Solr inference; ES/OS inference; Vectara; custom
- [ ] `hl:` fields populate highlight request for Solr
- [ ] `id:_id` mapping works for ES/OS

### Phase 5 — Paging & totals (cross‑engine)
- [ ] `pager()` end‑to‑end across all adapters
- [ ] `searcher.total` is accurate

**Integration tests (mock HTTP/JSONP):**
- [ ] Solr paging from 0→10→20
- [ ] ES paging from 0→10→20

### Phase 6 — Explain & highlighting UX
- [ ] Normalize explain structures into a common minimal shape `{ raw, summary? }`
- [ ] Highlighter substitutes `pre/post` tags

**Tests:**
- [ ] Solr explain available by id; ES explanation if present; Vectara unsupported
- [ ] `highlight()` respects tags

### Phase 7 — AngularJS Compatibility (optional but nice)
- [ ] Provide `compat/angular/splainerSearch.module.js` that registers a service mirroring the old API and proxies to ESM

**Tests:**
- [ ] Angular wrapper unit test (lightweight, run in jsdom)

### Phase 8 — Docs & examples
- [ ] README parity usage snippets for each engine
- [ ] Minimal examples in `examples/` browser + Node

---

## File tree (proposed)
```
/ (package root)
  api/
    index.js
  core/
    Searcher.js
    Doc.js
  adapters/
    EngineAdapter.js
    SolrAdapter.js
    ESAdapter.js
    VectaraAdapter.js
    CustomApiAdapter.js
  net/
    HttpTransport.js
    JsonpTransport.js
  util/
    fieldMapping.js
    explain/
      solr.js
      es.js
  compat/
    angular/
      splainerSearch.module.js (optional)
  test/
    unit/... (mirrors src folders)
    integration/
      solr.mock.test.js
      es.mock.test.js
      vectara.mock.test.js
      custom.mock.test.js
  examples/
    browser-solr.html
    node-es.mjs
```

---

## Test design (what to test)

### Unit tests (by module)
- **Doc**
  - `source()` returns raw normalized object
  - `highlight()` returns empty array/string when missing; renders pre/post tags
  - `explain()` returns parsed explain or throws NotSupported

- **EngineAdapter**
  - Throws on unimplemented `search()`

- **Searcher**
  - Creates Docs; retains `total`; preserves `params` across `pager()`

- **fieldMapping**
  - Parses `['id', 'title', 'hl:body', 'author']` into `{fields, highlightFields}`
  - Parses `['id:_id']` mapping for ES/OS

- **HttpTransport**
  - Success, non‑200, timeout

- **JsonpTransport**
  - Invokes global callback; cleans up; timeout

- **SolrAdapter**
  - Builds Solr params (`q`, `fq`, `start`, `rows`, `hl.fl`); parses response; next page state

- **ESAdapter**
  - POST DSL; parse hits; from/size paging

- **VectaraAdapter**
  - Sends headers; parses results; explain unsupported

- **CustomApiAdapter**
  - Validates mappers; maps totals/docs

### Integration tests (mocked HTTP/JSONP)
- Basic search happy paths for all adapters
- Paging sequences and totals
- Highlight + explain where supported

### Functional/integration (optional local services)
- **Docker compose** with local Solr and OpenSearch for smoke tests (skipped in CI by default)
  - Query index with tiny fixture data; assert >0 docs; `pager()` works; highlights present

### End‑to‑end (library usage)
- Browser demo loads `dist` build and performs a search against mock endpoints (MSW) or local Solr/OS; verifies DOM shows first title, next page on click.

---

## Definition of Done (per engine)
- All unit & integration tests pass
- README examples run verbatim
- For Solr: highlight + explain available by id; JSONP works behind no‑CORS
- For ES/OS: DSL posts; id mapping supported; explain surfaced if provided
- For Vectara: results returned; explain intentionally unsupported with clear error
- For CustomApi: mappers usable; sample provided

---

## Work breakdown as agent‑friendly TODOs
**Legend**: ⚙️=code, 🧪=test, 📄=docs

### 0. Infra
- [ ] 🧪 Add Vitest smoke test
- [ ] ⚙️ Add `pnpm`, vitest, eslint, prettier
- [ ] ⚙️ Setup `tsup` build (esm+cjs)
- [ ] 📄 Add CONTRIBUTING + scripts in README

### 1. Core domain
- [ ] 🧪 Doc.spec red cases for `source/highlight/explain`
- [ ] ⚙️ Implement `Doc`
- [ ] 🧪 EngineAdapter.spec (abstract contract)
- [ ] ⚙️ EngineAdapter base
- [ ] 🧪 Searcher.spec for: creates Docs, keeps total, pager
- [ ] ⚙️ Searcher

### 2. Transports
- [ ] 🧪 HttpTransport.spec (success, non‑200, timeout)
- [ ] ⚙️ HttpTransport
- [ ] 🧪 JsonpTransport.spec (callback + cleanup + timeout)
- [ ] ⚙️ JsonpTransport

### 3. Adapters
- [ ] 🧪 SolrAdapter.spec (params mapping, parse response, pager)
- [ ] ⚙️ SolrAdapter
- [ ] 🧪 ESAdapter.spec (DSL post, parse hits, paging)
- [ ] ⚙️ ESAdapter
- [ ] 🧪 VectaraAdapter.spec (headers, parse, explain unsupported)
- [ ] ⚙️ VectaraAdapter
- [ ] 🧪 CustomApiAdapter.spec (mapper validation + mapping)
- [ ] ⚙️ CustomApiAdapter

### 4. Factory & mapping
- [ ] 🧪 createSearcher.spec (engine inference, field parsing)
- [ ] ⚙️ `api/index.js`

### 5. Cross‑engine behavior
- [ ] 🧪 pager.spec (Solr & ES sequences)
- [ ] ⚙️ pager behavior fixes if needed

### 6. Compatibility & examples
- [ ] 🧪 Angular wrapper minimal test (optional)
- [ ] ⚙️ Angular wrapper
- [ ] 📄 Examples (browser + Node)
- [ ] 📄 README parity sections

### 7. Optional local e2e
- [ ] 📄 docker-compose: Solr + OpenSearch
- [ ] 🧪 smoke tests against local services (skipped in CI)

---

## Guardrails for Cline (context‑safe workflow)
1) **Pin the plan**: keep this document as `/PLAN.md`; make the agent open it before any change. Each run references the checklist item being executed.
2) **Work in branches**: `feat/adapter-solr`, `feat/transport-jsonp`, etc. One PR per checklist chunk.
3) **Use tiny prompts**: supply only the current spec/test and the smallest adjacent files. Avoid pasting the entire plan into every run.
4) **Test‑first contract**: always create/extend a spec file **before** src; run `pnpm test -w` after every commit.
5) **Snapshot diffs**: prefer explicit assertions over large snapshots; if snapshots are used, gate them behind `--update-snapshots` in a dedicated run.
6) **Golden fixtures**: keep JSON fixtures under `test/fixtures/{solr,es,vectara,custom}` to stabilize tests and reduce context size.
7) **Decision log**: `DECISIONS.md` with short entries (date, context, choice). The agent should append instead of rewriting history.
8) **API compatibility tests**: encode current README examples as executable tests to lock behavior.
9) **Static types (lightweight)**: add JSDoc types and `// @ts-check` to catch regressions with zero TS build overhead.
10) **Refusal policy**: if a task exceeds 250 LoC change, split it; the agent should stop and request a new subtask.

---

## Migration notes & risk callouts
- **JSONP vs CORS**: Keep JSONP for Solr parity, but default to HTTP+fetch. Allow override.
- **Explain divergence**: Normalize to a minimal `{ raw }` to avoid over‑promising.
- **Paging strategy**: ES/OS can later switch to `search_after`; parity first via `from/size`.
- **Angular wrapper**: optional; use only if you need true drop‑in.
- **Breaking changes**: If any become necessary, hide them behind adapter options; codify in `CHANGELOG.md` and tests.

---

## Milestones (merge gates)
1) **Core green**: Doc + Searcher + transports 100% unit coverage
2) **Solr parity**: SolrAdapter passing integration tests incl. JSONP
3) **ES/OS parity**: ESAdapter passing integration tests
4) **Vectara + Custom**: experimental adapters green w/ docs
5) **Public API parity**: `createSearcher` end‑to‑end tests pass for all engines
6) **Docs/Examples**: README code works verbatim; optional Angular wrapper

---

## Ready-to-code snippets (first tasks)
- **Vitest setup**
  ```json
  // package.json scripts
  {
    "scripts": {
      "build": "tsup api/index.js --format esm,cjs --dts --sourcemap",
      "test": "vitest run",
      "dev:test": "vitest"
    }
  }
  ```
- **Doc.spec.js (starter)**
  ```js
  import { describe, it, expect } from 'vitest'
  import { Doc } from '../../core/Doc.js'

  describe('Doc', () => {
    it('returns source and empty highlight/explain by default', () => {
      const d = new Doc({ source: { title: 'Moby' } })
      expect(d.source()).toEqual({ title: 'Moby' })
      expect(d.highlight('1', 'title', '<b>', '</b>')).toEqual('')
      expect(() => d.explain('1')).toThrow(/NotSupported/)
    })
  })
  ```

---

## Open questions (for later)
- Unify highlighting behavior across engines (arrays vs joined strings)?
- Include basic facet parsing in normalized results?
- Should we support streaming/abort signals for long requests?

