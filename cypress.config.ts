import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'
import path from 'path'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    screenshotOnRunFailure: false,
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor(path.resolve(__dirname, './vite.config.ts')))
    }
  },
  component: {
    specPattern: 'cypress/component/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})
