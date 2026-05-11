import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
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
  root: projectRoot,
  define: createSpaVersionDefines(projectRoot),
  plugins: [
    react(),
    istanbul({
      cypress: true,
      requireEnv: false
    })
  ],
  preview: {
    port: 5173
  },
  server: {
    //https://github.com/vitejs/vite/discussions/3396
    host: true,
    port: 5173,
    hmr: {
      clientPort: 443 // nginx reverse proxy port
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'src'),
      '@tests': path.resolve(projectRoot, 'tests')
    }
  }
})
