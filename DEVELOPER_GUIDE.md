# Developer Guide

## Project Layout

- `src/`: Library source code.
- `api/`: Public API surface used by the entrypoint.
- `services/`, `core/`, `adapters/`, `factories/`, `values/`: Internal modules.
- `module.js`: Package entrypoint (re-exports `src/api/index.js`).
- `test/`: Unit and integration tests (Vitest).

## Prerequisites

- Node.js (ESM support required).
- pnpm.
- Docker (required for integration tests that use `testcontainers`).

## Install Dependencies

```bash
pnpm install
```

## Development Workflow

### Run Tests

```bash
pnpm test
```

Run the watch mode during development:

```bash
pnpm run dev:test
```

### Lint

```bash
pnpm run lint
```

Automatically fix lint issues:

```bash
pnpm run lint:fix
```

### Build

```bash
pnpm run build
```

The build uses `esbuild` to generate the CJS bundle.

## Testing Notes

- Unit tests run as part of `pnpm test`.
- Integration tests rely on `testcontainers` and require a working Docker daemon.
  If Docker is unavailable, integration tests may fail or be skipped.

## Publishing / Consumption

The package entrypoint is `module.js`, which re-exports the API from
`src/api/index.js`. Consumers should import from `splainer-search` directly.
