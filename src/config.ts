import * as z from 'zod'

declare global {
  interface Window {
    __APP_CONFIG__: AppConfig | undefined
  }
}

let CONFIG: AppConfig | undefined

const AppConfigSchema = z.object({
  backendUrl: z.url(),
  oidc: z.object({
    clientId: z.string(),
    authorizationEndpoint: z.url(),
    tokenEndpoint: z.url(),
    logoutEndpoint: z.url(),
    localStorageKeyPrefix: z.string()
  }),
  defaultLanguage: z.string(),
  languages: z.array(
    z.object({
      code: z.string(),
      name: z.string()
    })
  )
})

export type AppConfig = z.infer<typeof AppConfigSchema>

export type AppConfigResult =
  | { ok: true; value: AppConfig }
  | { ok: false; message: string; schemaError?: string }

/**
 * This function initializes the application configuration by validating and loading it from the global window object.
 * There is a script tag in index.html that loads /config.js at runtime, which sets window.__APP_CONFIG__.
 * This helps changing configuration at runtime without rebuilding the application.
 * It returns an object indicating whether the initialization was successful or not, along with the configuration value or an error message.
 */
export function initAppConfig(): AppConfigResult {
  const raw = typeof window !== 'undefined' ? window.__APP_CONFIG__ : undefined

  if (!raw) {
    return {
      ok: false,
      message: import.meta.env.DEV
        ? 'Configuration not found. Make sure public/config.js exists.'
        : 'Configuration not found. Make sure that config.js exists.'
    }
  }

  const parsed = AppConfigSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      message: import.meta.env.DEV
        ? 'Invalid configuration. Make sure your public/config.js file matches the schema defined in src/config.ts -> AppConfigSchema.'
        : 'Invalid configuration. Make sure you have a valid config.js file.',
      schemaError: z.prettifyError(parsed.error)
    }
  }

  CONFIG = parsed.data

  return { ok: true, value: CONFIG }
}

export function requireAppConfig(): AppConfig {
  if (!CONFIG) {
    const result = initAppConfig()
    if (!result.ok) {
      const details = result.schemaError ? `\n${result.schemaError}` : ''
      throw new Error(`${result.message}${details}`)
    }
  }
  return CONFIG as AppConfig
}
