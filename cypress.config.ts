import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'
import path from 'path'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:8000',
    specPattern: 'tests/e2e-integration/**/*.spec.{js,jsx,ts,tsx}',
    fixturesFolder: 'tests/e2e-integration/fixtures',
    screenshotOnRunFailure: false,
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    supportFile: 'tests/support/e2e.ts',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor(path.resolve(__dirname, './vite.config.ts')))
    },
    defaultCommandTimeout: 10_000 // https://docs.cypress.io/guides/references/configuration#Timeouts
  },
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
    frontendBasePath: '/modern',
    backendUrl: 'http://localhost:8000',
    oidcClientId: 'test',
    oidcAuthorizationEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/auth',
    oidcTokenEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/token',
    oidcLogoutEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/logout',
    oidcLocalStorageKeyPrefix: 'DV_',
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ],
    defaultLanguage: 'en',
    branding: {
      dataverseName: 'Dataverse'
    },
    homepage: {
      supportUrl: 'https://support.dataverse.harvard.edu/'
    },
    footer: {
      copyrightHolder: 'The President & Fellows of Harvard College',
      privacyPolicyUrl: 'https://support.dataverse.harvard.edu/harvard-dataverse-privacy-policy'
    },
    codeCoverage: {
      exclude: ['tests/**/*.*', '**/ErrorPage.tsx', '**/EditGuestBook.tsx']
    }
  }
})
