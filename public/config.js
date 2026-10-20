// Runtime configuration for Dataverse Frontend
// Edit values to match your environment.
// This file is loaded at runtime (no rebuild required) and validated against src/config.ts schema.

// Follows the host the page was opened on: localhost:8000, or 127.0.0.1:8000 for the ORCID sandbox.
const devProxyOrigin = window.location.origin

window.__APP_CONFIG__ = {
  // Base URL of your Dataverse backend
  backendUrl: devProxyOrigin,
  // Optional banner shown at the top of the app when set. Basic HTML markup is supported.
  // Use a string for one message across all languages, or map language codes to localized messages.
  bannerMessage: {
    en: "You are using the new Dataverse <strong>Modern version</strong>. This is an early release and some features from the original site are not yet available. Please see the <a href='https://dataverse.harvard.edu/modern/featured-item/harvard/1'>Project Roadmap</a> for details.",
    es: "Está utilizando la nueva <strong>versión moderna</strong> de Dataverse. Esta es una versión preliminar y algunas funciones del sitio original aún no están disponibles. Consulte la <a href='https://dataverse.harvard.edu/modern/featured-item/harvard/1'>hoja de ruta del proyecto</a> para más detalles."
  },
  // OIDC provider settings
  oidc: {
    clientId: 'test',
    authorizationEndpoint: `${devProxyOrigin}/realms/test/protocol/openid-connect/auth`,
    tokenEndpoint: `${devProxyOrigin}/realms/test/protocol/openid-connect/token`,
    logoutEndpoint: `${devProxyOrigin}/realms/test/protocol/openid-connect/logout`,
    // All auth-related storage keys will be prefixed with this string
    localStorageKeyPrefix: 'DV_'
  },
  // Optional. Show "Sign Up" links to the sign-up page. Requires the backend's
  // dataverse.feature.api-builtin-user-signup feature flag and :AllowSignUp.
  signUpEnabled: true,
  // Optional. Let new users connect their ORCID iD on the sign-up form. Requires an ORCID OAuth2
  // provider in the backend and this SPA's sign-up URL in dataverse.api.signup.orcid-redirect-uris.
  signUpWithOrcidEnabled: false,
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
