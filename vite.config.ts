import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import { keycloakify } from 'keycloakify/vite-plugin'
import * as path from 'path'

const sharedBuildModuleUrl = [
  new URL('./build/spaVersionMetadata.mjs', import.meta.url),
  new URL('../build/spaVersionMetadata.mjs', import.meta.url),
  new URL('../../build/spaVersionMetadata.mjs', import.meta.url)
].find((candidate) => existsSync(fileURLToPath(candidate)))

if (!sharedBuildModuleUrl) {
  throw new Error('Could not locate build/spaVersionMetadata.mjs')
}

const { createSpaVersionDefines, resolveProjectRoot } = (await import(sharedBuildModuleUrl.href)) as {
  createSpaVersionDefines: (projectRoot: string) => Record<string, string>
  resolveProjectRoot: (configDir: string) => string
}

const projectRoot = resolveProjectRoot(__dirname)

const definedOnly = (values: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(values).filter((entry): entry is [string, string] => Boolean(entry[1]))
  )

// In dev, apply the same env overrides as scripts/write-runtime-config.mjs to public/config.js,
// taken from .env.<mode> (e.g. `vite --mode backend-dev`) or the shell
function runtimeConfigOverrides(): Plugin {
  let backendOverrides: Record<string, string> = {}
  let oidcOverrides: Record<string, string> = {}
  let configPath = ''

  return {
    name: 'dataverse-runtime-config-overrides',
    apply: 'serve',
    configResolved(config) {
      // Also picks up prefixed variables from the shell, which take precedence
      const env = loadEnv(config.mode, config.root, ['DATAVERSE_BACKEND_URL', 'OIDC_'])
      backendOverrides = definedOnly({ backendUrl: env.DATAVERSE_BACKEND_URL })
      oidcOverrides = definedOnly({
        clientId: env.OIDC_CLIENT_ID,
        authorizationEndpoint: env.OIDC_AUTHORIZATION_ENDPOINT,
        tokenEndpoint: env.OIDC_TOKEN_ENDPOINT,
        logoutEndpoint: env.OIDC_LOGOUT_ENDPOINT,
        localStorageKeyPrefix: env.OIDC_STORAGE_KEY_PREFIX
      })
      configPath = `${config.base.replace(/\/$/, '')}/config.js`
    },
    configureServer(server) {
      if (!Object.keys(backendOverrides).length && !Object.keys(oidcOverrides).length) return

      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== configPath) return next()

        const source = readFileSync(path.resolve(__dirname, 'public/config.js'), 'utf8')
        res.setHeader('Content-Type', 'application/javascript')
        res.end(
          `${source}\n` +
            `Object.assign(window.__APP_CONFIG__, ${JSON.stringify(backendOverrides)})\n` +
            `Object.assign(window.__APP_CONFIG__.oidc, ${JSON.stringify(oidcOverrides)})\n`
        )
      })
    }
  }
}

export default defineConfig({
  base: '/modern',
  define: createSpaVersionDefines(projectRoot),
  plugins: [
    runtimeConfigOverrides(),
    react(),
    istanbul({
      cypress: true,
      requireEnv: false
    }),
    keycloakify({
      themeName: 'dataverse-spa',
      keycloakifyBuildDirPath: './dist_keycloak',
      accountThemeImplementation: 'none',
      keycloakVersionTargets: {
        '22-to-25': false,
        'all-other-versions': 'dv-spa-kc-theme.jar'
      }
    })
  ],
  optimizeDeps: {
    include: ['react-dom/client']
  },
  preview: {
    port: 5173
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  }
})
