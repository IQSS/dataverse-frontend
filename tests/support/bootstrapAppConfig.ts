// Ensure runtime app config exists in Cypress (e2e and component) before any test code runs.
// This mimics public/config.js but lets tests override values via Cypress.env.

import { initAppConfig, type AppConfig } from '@/config'

declare global {
  interface Window {
    __APP_CONFIG__: AppConfig | undefined
  }
}

function buildTestConfig(): AppConfig {
  const backendUrl: string = (Cypress.env('backendUrl') as string) || 'http://localhost:8000'
  const realmBase =
    (Cypress.env('realmBase') as string) || `${backendUrl}/realms/test/protocol/openid-connect`

  return {
    backendUrl,
    oidc: {
      clientId: (Cypress.env('oidcClientId') as string) || 'test',
      authorizationEndpoint:
        (Cypress.env('oidcAuthorizationEndpoint') as string) || `${realmBase}/auth`,
      tokenEndpoint: (Cypress.env('oidcTokenEndpoint') as string) || `${realmBase}/token`,
      logoutEndpoint: (Cypress.env('oidcLogoutEndpoint') as string) || `${realmBase}/logout`,
      localStorageKeyPrefix: (Cypress.env('oidcLocalStorageKeyPrefix') as string) || 'DV_'
    },
    languages: (Cypress.env('languages') as { code: string; name: string }[]) || [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ],
    defaultLanguage: (Cypress.env('defaultLanguage') as string) || 'en'
  }
}

export function applyTestAppConfig() {
  if (typeof window !== 'undefined') {
    window.__APP_CONFIG__ = buildTestConfig()
  }
  const result = initAppConfig()
  if (!result.ok) {
    console.error('Cypress bootstrapAppConfig: invalid configuration', result)
  }
  return result
}

// Apply config immediately when this module is loaded
if (typeof window !== 'undefined') {
  applyTestAppConfig()
}

/**
 * Builds the body of a config.js response for intercepting in Cypress e2e tests.
 * @example
  it(
    'test description',
    // The second argument let us set Cypress.env variables for this test only
    // These Cypress.env values will be used by buildTestConfig()
    {
      env: {
        LANGUAGES: [
          { code: 'en', name: 'English' },
          { code: 'it', name: 'Italiano' }
        ]
      }
    },
    () => {
      // Then we intercept the config.js request and respond with our custom confige
      cy.intercept(
        { method: 'GET', url: 'config.js' },
        {
          statusCode: 200,
          headers: { 'content-type': 'application/javascript' },
          body: buildConfigJsBody()
        }
      )

      cy.visit('/spa/')

      // Test assertions here
    }
  )
 */
export function buildConfigJsBody(): string {
  const cfg = buildTestConfig()
  return `window.__APP_CONFIG__ = ${JSON.stringify(cfg)};`
}
