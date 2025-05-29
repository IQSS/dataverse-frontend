import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import * as path from 'path'

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
      clientPort: 443 // nginx reverse proxy port
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  }
})
