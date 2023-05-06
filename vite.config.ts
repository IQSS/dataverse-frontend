import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
  }
})
