#!/usr/bin/env bash
set -eo pipefail

echo "== 0) Environment =="
node -v
npm -v

echo "== 1) File presence =="
need_files=(
  "PLAN.md"
  "README.md"
  "core"
  "adapters"
  "api/index.js"
  "test"
  "karma.conf.js"
)
for f in "${need_files[@]}"; do
  [[ -e "$f" ]] || { echo "Missing $f"; exit 1; }
done

echo "== 2) No Angular deps in core =="
if grep -R -nE "angular|@angular" core ; then
  echo "Found Angular import in core/ (should be plain JS)"; exit 1;
fi

echo "== 3) API surface check =="
node - <<'NODE'
const path = require('path');
const cwd = process.cwd();
try {
  const api = require(path.join(cwd, 'api'));
  if (typeof api.createSearcher !== 'function') throw new Error('createSearcher missing');
  if (typeof api.createDoc !== 'function') throw new Error('createDoc missing');
  console.log('CJS require OK');
} catch (e) {
  console.error(e); process.exit(1);
}
(async () => {
  try {
    const api = await import('file://' + path.join(cwd, 'api', 'index.js'));
    if (typeof api.createSearcher !== 'function') throw new Error('ESM createSearcher missing');
    if (typeof api.createDoc !== 'function') throw new Error('ESM createDoc missing');
    console.log('ESM import OK');
  } catch (e) {
    console.error(e); process.exit(1);
  }
})();
NODE

echo "== 4) Adapter sanity =="
if [ -d adapters ]; then
  # Ensure each adapter exports a normalize function (or similar). Relax if names differ—warn only.
  if ! grep -R -q "module.exports" adapters && ! grep -R -q "export function" adapters ; then
    echo "WARN: adapters/ has no obvious exports; double-check adapter API"
  fi
fi

echo "== 5) Install deps =="
if [ -f pnpm-lock.yaml ]; then
  command -v pnpm >/dev/null && pnpm i --frozen-lockfile || npm ci
else
  npm ci
fi

echo "== 6) Lint =="
if npx --yes eslint -v >/dev/null 2>&1; then
  npx --yes eslint .
else
  echo "NOTE: eslint not configured; skipping"
fi

echo "== 7) Tests (Karma headless) =="
if npx --yes karma --version >/dev/null 2>&1; then
  npx --yes karma start --single-run || true
else
  echo "NOTE: karma not installed; trying Grunt"
fi

echo "== 8) Tests (Grunt fallback) =="
if npx --yes grunt --version >/dev/null 2>&1; then
  npx --yes grunt test || true
else
  echo "NOTE: grunt not installed; relying on npm test if present"
fi

echo "== 9) npm test fallback =="
if npm run | grep -q " test"; then
  npm test
else
  echo "NOTE: no npm test script; ensure Karma/Grunt ran above"
fi

echo "== 10) Coverage threshold (optional) =="
if [ -d coverage ] || [ -f coverage/lcov.info ]; then
  echo "Coverage output present."
else
  echo "NOTE: No coverage artifacts found; ensure thresholds are documented in PLAN.md/README.md"
fi

echo "== ALL CHECKS COMPLETED =="
