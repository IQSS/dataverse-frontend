import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.ts',
    deps: {
      inline: [/dataverse-ui-lib/]
    },
    include: [
      './tests/**/*.(test).(ts|tsx)',
      './packages/dataverse-ui-lib/tests/**/*.(test).(ts|tsx)'
    ],
    coverage: {
      reporter: ['lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'packages/dataverse-ui-lib/dist/',
        'packages/dataverse-ui-lib/node_modules/'
      ],
      lines: 95,
      functions: 95,
      branches: 95,
      statements: 95
    }
  }
})
