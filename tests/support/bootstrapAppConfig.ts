// Ensure runtime app config exists in Cypress (e2e and component) before any test code runs.
// This mimics public/config.js but lets tests override values via Cypress.env.

import { initAppConfig, type AppConfig } from '@/config'

declare global {
  interface Window {
    __APP_CONFIG__: AppConfig | undefined
  }
}

function buildTestConfig(): AppConfig {
  const backendUrl: string = (Cypress.env('BACKEND_URL') as string) || 'http://localhost:8000'
  const realmBase =
    (Cypress.env('OIDC_REALM_BASE') as string) ||
    `${backendUrl}/realms/test/protocol/openid-connect`

  return {
    backendUrl,
    oidc: {
      clientId: (Cypress.env('OIDC_CLIENT_ID') as string) || 'test',
      authorizationEndpoint: (Cypress.env('OIDC_AUTH_ENDPOINT') as string) || `${realmBase}/auth`,
      tokenEndpoint: (Cypress.env('OIDC_TOKEN_ENDPOINT') as string) || `${realmBase}/token`,
      logoutEndpoint: (Cypress.env('OIDC_LOGOUT_ENDPOINT') as string) || `${realmBase}/logout`,
      localStorageKeyPrefix: (Cypress.env('OIDC_LS_PREFIX') as string) || 'DV_'
    },
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ],
    defaultLanguage: 'en'
  }
}

if (typeof window !== 'undefined') {
  window.__APP_CONFIG__ = buildTestConfig()
}

const result = initAppConfig()
if (!result.ok) {
  console.error('Cypress bootstrapAppConfig: invalid configuration', result)
}
