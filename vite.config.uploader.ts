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
    // Bundle CSS into the JS module instead of emitting separate .css files.
    //
    // Default behaviour appends a `<style>` element to `document.head` at
    // import time. We override it to push CSS strings onto a global queue
    // (`window.__dvPendingStyles`) so the standalone wrapper can adopt the
    // styles into a Shadow DOM root at mount time, isolating both
    // directions: host-page CSS does not cascade into the component, and
    // component CSS does not leak into the host page.
    //
    // The wrapper drains the queue in `mountInShadowRoot()` (see
    // `src/standalone-shared/shadow-mount.ts`).
    cssInjectedByJsPlugin({
      // `cssCode` arrives already-JSON-encoded as a JS string literal.
      // (Same convention as the plugin's default `injectCode` example.)
      injectCode: (cssCode) =>
        `(function(){if(typeof window!=='undefined'){(window.__dvPendingStyles=window.__dvPendingStyles||[]).push(${cssCode});}})()`,
      // Inject the queue-push into every entry bundle, not just one.
      // Without this, the plugin picks a single entry to host the
      // injection; loading the other entry alone would leave its
      // shadow root unstyled.
      jsAssetsFilterFunction: (chunk) => chunk.isEntry === true
    })
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
        'dv-uploader': path.resolve(__dirname, 'src/standalone-uploader/index.tsx'),
        'dv-tree-view': path.resolve(__dirname, 'src/standalone-tree-view/index.tsx')
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
          // i18next first — `react-i18next` would otherwise match the broader
          // react chunk below.
          if (/\/node_modules\/(i18next|react-i18next|i18next-http-backend)\//.test(id)) {
            return 'i18n'
          }
          // Match only the React core packages so we don't sweep in unrelated
          // packages whose names happen to include "react" (react-bootstrap,
          // react-router-dom, react-toastify, etc.).
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
            return 'react'
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
