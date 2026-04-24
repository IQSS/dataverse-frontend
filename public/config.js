// Runtime configuration for Dataverse Frontend
// Edit values to match your environment.
// This file is loaded at runtime (no rebuild required) and validated against src/config.ts schema.

window.__APP_CONFIG__ = {
  // Base URL of your Dataverse backend
  backendUrl: 'http://localhost:8000',
  // Optional banner shown at the top of the app when set. Basic HTML markup is supported.
  bannerMessage:
    'You are using the new Dataverse <strong>Modern version</strong>. This is an early release and some features from the original site are not yet available.',
  // OIDC provider settings
  oidc: {
    clientId: 'test',
    authorizationEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/token',
    logoutEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/logout',
    // All auth-related storage keys will be prefixed with this string
    localStorageKeyPrefix: 'DV_'
  },
  // UI languages available to users (if more than one is provided a language switcher will be shown)
  languages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ],
  // Default language code from the list above
  defaultLanguage: 'en',
  // Optional branding values for homepage/footer text
  branding: {
    // Used in homepage strings such as "{{dataverseName}} is a repository..."
    dataverseName: 'Harvard Dataverse'
  },
  homepage: {
    supportUrl: 'https://support.dataverse.harvard.edu/'
  },
  footer: {
    copyrightHolder: 'The President & Fellows of Harvard College',
    privacyPolicyUrl: 'https://support.dataverse.harvard.edu/harvard-dataverse-privacy-policy'
  }
}
