import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import { keycloakify } from 'keycloakify/vite-plugin'
import * as path from 'path'
import {
  RUNTIME_CONFIG_ENV_PREFIXES,
  buildRuntimeConfig,
  hasRuntimeConfigOverrides,
  serializeRuntimeConfig
} from './scripts/runtime-config.mjs'

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

// In dev, serve public/config.js with the same env overrides write-runtime-config.mjs applies,
// taken from .env.<mode> (e.g. `vite --mode backend-dev`) or the shell
function runtimeConfigOverrides(): Plugin {
  let env: Record<string, string> = {}
  let configPath = ''

  return {
    name: 'dataverse-runtime-config-overrides',
    apply: 'serve',
    configResolved(config) {
      // Also picks up prefixed variables from the shell, which take precedence
      env = loadEnv(config.mode, config.root, RUNTIME_CONFIG_ENV_PREFIXES)
      configPath = `${config.base.replace(/\/$/, '')}/config.js`
    },
    configureServer(server) {
      if (!hasRuntimeConfigOverrides(env)) return

      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== configPath) return next()

        buildRuntimeConfig(path.resolve(__dirname, 'public/config.js'), env)
          .then((runtimeConfig) => {
            res.setHeader('Content-Type', 'application/javascript')
            res.end(serializeRuntimeConfig(runtimeConfig))
          })
          .catch(next)
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
