import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

// Environment variables that override values from public/config.js
export const RUNTIME_CONFIG_ENV_PREFIXES = ['DATAVERSE_BACKEND_URL', 'OIDC_']

export async function buildRuntimeConfig(sourcePath, env = process.env) {
  const source = await readFile(sourcePath, 'utf8')

  const sandbox = { window: {} }
  vm.createContext(sandbox)
  new vm.Script(source, { filename: sourcePath }).runInContext(sandbox)

  const baseConfig = sandbox.window.__APP_CONFIG__

  if (!baseConfig || typeof baseConfig !== 'object') {
    throw new Error(`Expected window.__APP_CONFIG__ to be defined in ${sourcePath}`)
  }

  const withOverride = (key, value) => (value ? { [key]: value } : {})

  return {
    ...baseConfig,
    ...withOverride('backendUrl', env.DATAVERSE_BACKEND_URL),
    oidc: {
      ...baseConfig.oidc,
      ...withOverride('clientId', env.OIDC_CLIENT_ID),
      ...withOverride('authorizationEndpoint', env.OIDC_AUTHORIZATION_ENDPOINT),
      ...withOverride('tokenEndpoint', env.OIDC_TOKEN_ENDPOINT),
      ...withOverride('logoutEndpoint', env.OIDC_LOGOUT_ENDPOINT),
      ...withOverride('localStorageKeyPrefix', env.OIDC_STORAGE_KEY_PREFIX)
    }
  }
}

export function serializeRuntimeConfig(runtimeConfig) {
  return `window.__APP_CONFIG__ = ${JSON.stringify(runtimeConfig, null, 2)}\n`
}

export function hasRuntimeConfigOverrides(env) {
  return Object.keys(env).some(
    (key) => env[key] && RUNTIME_CONFIG_ENV_PREFIXES.some((prefix) => key.startsWith(prefix))
  )
}
