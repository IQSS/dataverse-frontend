import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.ts',
    deps: {
      inline: [/design-system/]
    },
    include: [
      './tests/**/*.(test).(ts|tsx)',
      './packages/design-system/tests/**/*.(test).(ts|tsx)'
    ],
    coverage: {
      reporter: ['lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'packages/design-system/dist/',
        'packages/design-system/node_modules/'
      ],
      lines: 95,
      functions: 95,
      branches: 95,
      statements: 95
    }
  }
})
