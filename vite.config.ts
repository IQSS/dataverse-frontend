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
  // index.tsx lazy-loads index.app, so deps reached only through that lazy
  // chunk trigger a mid-run optimizeDeps re-run; the first cy.visit then
  // races it and gets a torn React module graph (useState becomes null).
  optimizeDeps: {
    entries: ['index.html', 'src/index.app.tsx'],
    include: ['react-dom/client']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  }
})
