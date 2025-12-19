import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.js'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'test/**',
        'vitest.config.js',
        'module.js',
        'adapters/algolia/**',
        'adapters/elasticsearch/**',
        'adapters/searchApi/**',
        'adapters/solr/**',
        'adapters/vectara/**',
      ],
    },
  },
});
