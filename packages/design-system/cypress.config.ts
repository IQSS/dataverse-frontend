import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  component: {
    indexHtmlFile: 'tests/support/component-index.html',
    specPattern: ['tests/component/**/*.spec.{js,jsx,ts,tsx}'],
    supportFile: 'tests/support/component.ts',
    fixturesFolder: 'tests/component/fixtures',
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    setupNodeEvents(on, config) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config)

      return config
    }
  },
  env: {
    codeCoverage: {
      exclude: ['tests/**/*.*', '**/Tab.tsx']
    }
  }
})
