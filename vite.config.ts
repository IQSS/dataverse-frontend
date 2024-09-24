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
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  }
})
