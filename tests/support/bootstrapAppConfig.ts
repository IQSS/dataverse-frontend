// Ensure runtime app config exists in Cypress (e2e and component) before any test code runs.
// This mimics public/config.js but lets tests override values via Cypress.env.

import { initAppConfig, type AppConfig } from '@/config'

declare global {
  interface Window {
    __APP_CONFIG__: AppConfig | undefined
  }
}

function buildTestConfig(): AppConfig {
  const bannerMessage = Cypress.env('bannerMessage') as AppConfig['bannerMessage']
  const branding = (Cypress.env('branding') as AppConfig['branding']) ?? {
    dataverseName: 'Dataverse'
  }
  const homepage = (Cypress.env('homepage') as AppConfig['homepage']) ?? {
    supportUrl: 'https://support.dataverse.harvard.edu/'
  }
  const footer = (Cypress.env('footer') as AppConfig['footer']) ?? {
    copyrightHolder: 'The President & Fellows of Harvard College',
    privacyPolicyUrl: 'https://support.dataverse.harvard.edu/harvard-dataverse-privacy-policy'
  }

  return {
    backendUrl: Cypress.env('backendUrl') as string,
    bannerMessage,
    oidc: {
      clientId: Cypress.env('oidcClientId') as string,
      authorizationEndpoint: Cypress.env('oidcAuthorizationEndpoint') as string,
      tokenEndpoint: Cypress.env('oidcTokenEndpoint') as string,
      logoutEndpoint: Cypress.env('oidcLogoutEndpoint') as string,
      localStorageKeyPrefix: Cypress.env('oidcLocalStorageKeyPrefix') as string
    },
    languages: Cypress.env('languages') as { code: string; name: string }[],
    defaultLanguage: Cypress.env('defaultLanguage') as string,
    branding,
    homepage,
    footer
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
 * Builds the body of a config.js response for intercepting in Cypress e2e tests. More info on DEVELOPER_GUIDE.md "Mocking runtime configuration in tests"
 */
export function buildConfigJsBody(): string {
  const cfg = buildTestConfig()
  return `window.__APP_CONFIG__ = ${JSON.stringify(cfg)};`
}
