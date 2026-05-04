/**
 * Vite Configuration for Reusable Dataverse Frontend Components
 *
 * This configuration builds reusable components as standalone ESM entry points.
 * Shared dependencies are emitted as chunks so additional components can reuse
 * React, i18n, and common libraries instead of bundling them repeatedly.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import * as path from 'path'

export default defineConfig({
  plugins: [
    react(),
    // Inject CSS into the JS bundle so we only have a single file to load
    cssInjectedByJsPlugin()
  ],
  // Don't copy public folder contents
  publicDir: false,
  // Optimize deps to properly handle the local linked CommonJS package
  optimizeDeps: {
    include: ['@iqss/dataverse-client-javascript']
  },
  build: {
    outDir: 'dist-uploader',
    emptyOutDir: true,
    // Target modern browsers for smaller bundle size
    target: 'es2020',
    // Force CommonJS interop for linked packages
    commonjsOptions: {
      include: [/node_modules/, /dataverse-client-javascript/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      input: {
        'dv-uploader': path.resolve(__dirname, 'src/standalone-uploader/index.tsx')
      },
      output: {
        entryFileNames: 'reusable-components/[name].js',
        chunkFileNames: 'reusable-components/chunks/[name]-[hash].js',
        assetFileNames: 'reusable-components/assets/[name].[ext]',
        manualChunks(id) {
          if (
            id.includes('/src/sections/shared/') ||
            id.includes('/src/files/') ||
            id.includes('/src/dataset/') ||
            id.includes('/packages/design-system/')
          ) {
            return 'dataverse-shared'
          }
          if (!id.includes('node_modules')) {
            return
          }
          if (id.includes('react') || id.includes('scheduler')) {
            return 'react'
          }
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18n'
          }
          return 'vendor'
        }
      }
    },
    // Copy translation files to dist
    copyPublicDir: false,
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'esbuild',
    // Generate sourcemaps for debugging
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  },
  define: {
    // Define production mode
    'process.env.NODE_ENV': '"production"'
  }
})
