import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
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

export default defineConfig({
  base: '/modern',
  define: createSpaVersionDefines(projectRoot),
  plugins: [
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
