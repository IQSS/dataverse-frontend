/**
 * Vite Configuration for Standalone DVWebloader V2 Bundle
 *
 * This configuration builds the file uploader as a standalone bundle
 * that can be used independently from the main Dataverse SPA.
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
      input: path.resolve(__dirname, 'src/standalone-uploader/index.tsx'),
      output: {
        // Single entry file
        entryFileNames: 'dvwebloader-v2.js',
        // Inline all chunks into the main bundle
        inlineDynamicImports: true,
        // Asset file naming
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    // Copy translation files to dist
    copyPublicDir: false,
    // Increase chunk size warning limit since we're bundling everything
    chunkSizeWarningLimit: 2000,
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
