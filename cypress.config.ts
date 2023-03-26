import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'
import path from 'path'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'tests/e2e/tests/**/*.spec.{js,jsx,ts,tsx}',
    screenshotOnRunFailure: false,
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    supportFile: 'tests/e2e/support/e2e.ts',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor(path.resolve(__dirname, './vite.config.ts')))
    }
  },
  component: {
    specPattern: 'tests/component/tests/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: 'tests/component/support/component.ts',
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})
