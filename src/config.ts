export const DATAVERSE_BACKEND_URL = (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''

export const OIDC_AUTH_CONFIG = {
  CLIENT_ID: (import.meta.env.VITE_OIDC_CLIENT_ID as string) ?? '',
  AUTHORIZATION_ENDPOINT: (import.meta.env.VITE_OIDC_AUTHORIZATION_ENDPOINT as string) ?? '',
  TOKEN_ENDPOINT: (import.meta.env.VITE_OIDC_TOKEN_ENDPOINT as string) ?? '',
  LOGOUT_ENDPOINT: (import.meta.env.VITE_OIDC_LOGOUT_ENDPOINT as string) ?? '',
  LOCAL_STORAGE_KEY_PREFIX: (import.meta.env.VITE_OIDC_STORAGE_KEY_PREFIX as string) ?? ''
}
