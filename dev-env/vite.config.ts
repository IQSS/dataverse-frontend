import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import * as path from 'path'
import { readFileSync } from 'fs';

const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
) as {
  version: string
  dependencies: Record<string, string>
}

export default defineConfig({
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
      clientPort: 8000 // nginx reverse proxy port
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  },
  define: {
    __DATAVERSE_FRONTEND_VERSION__: JSON.stringify(packageJson.version),
    __DATAVERSE_CLIENT_JAVASCRIPT_VERSION__: JSON.stringify(packageJson.dependencies['@iqss/dataverse-client-javascript']),
  },
})
