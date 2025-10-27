window.__APP_CONFIG__ = {
  backendUrl: 'http://localhost:8000',
  oidc: {
    clientId: 'test',
    authorizationEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/token',
    logoutEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/logout',
    localStorageKeyPrefix: 'DV_'
  },
  languages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ],
  defaultLanguage: 'en'
}
