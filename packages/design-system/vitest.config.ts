import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['./tests/vitest/**/*.(test).(ts|tsx)'],
    setupFiles: './tests/vitest/setupTests.ts',
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
