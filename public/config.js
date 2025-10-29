// Runtime configuration for Dataverse Frontend
// Edit values to match your environment.
// This file is loaded at runtime (no rebuild required) and validated against src/config.ts schema.

window.__APP_CONFIG__ = {
  // Base URL of your Dataverse backend
  backendUrl: 'http://localhost:8000',
  // OIDC provider settings
  oidc: {
    clientId: 'test',
    authorizationEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/token',
    logoutEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/logout',
    // All auth-related storage keys will be prefixed with this string
    localStorageKeyPrefix: 'DV_'
  },
  // UI languages available to users
  languages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ],
  // Default language code from the list above
  defaultLanguage: 'en'
}
