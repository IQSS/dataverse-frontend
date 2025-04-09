export const DATAVERSE_BACKEND_URL = getEnvVar('VITE_DATAVERSE_BACKEND_URL')

export const OIDC_AUTH_CONFIG = {
  CLIENT_ID: getEnvVar('VITE_OIDC_CLIENT_ID'),
  AUTHORIZATION_ENDPOINT: getEnvVar('VITE_OIDC_AUTHORIZATION_ENDPOINT'),
  TOKEN_ENDPOINT: getEnvVar('VITE_OIDC_TOKEN_ENDPOINT'),
  LOGOUT_ENDPOINT: getEnvVar('VITE_OIDC_LOGOUT_ENDPOINT'),
  LOCAL_STORAGE_KEY_PREFIX: getEnvVar('VITE_OIDC_STORAGE_KEY_PREFIX')
}

function getEnvVar(key: string): string {
  const value = import.meta.env[key] as string | undefined
  if (!value) {
    throw new Error(`${key} environment variable should be specified.`)
  }
  return value
}
