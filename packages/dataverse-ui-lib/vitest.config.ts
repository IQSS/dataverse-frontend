import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['./tests/**/*.(test).(ts|tsx)'],
    setupFiles: './tests/setupTests.ts',
    coverage: {
      reporter: ['lcov'],
      exclude: ['node_modules/', 'tests/'],
      lines: 95,
      functions: 95,
      branches: 95,
      statements: 95
    }
  }
})
