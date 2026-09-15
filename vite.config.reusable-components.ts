import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import * as path from 'path'
import { readFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin({
      injectCode: (cssCode) =>
        `(function(){if(typeof window!=='undefined'){(window.__dvPendingStyles=window.__dvPendingStyles||[]).push(${cssCode});}})()`,
      jsAssetsFilterFunction: (chunk) => chunk.isEntry === true
    }),
    {
      name: 'emit-zip-download-service-worker',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'reusable-components/zip-download-sw.js',
          source: readFileSync(path.resolve(__dirname, 'public/zip-download-sw.js'), 'utf-8')
        })
      }
    }
  ],
  publicDir: false,
  optimizeDeps: {
    include: ['@iqss/dataverse-client-javascript']
  },
  build: {
    outDir: 'dist-reusable-components',
    emptyOutDir: true,
    target: 'es2020',
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
          if (/\/node_modules\/(i18next|react-i18next|i18next-http-backend)\//.test(id)) {
            return 'i18n'
          }
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
            return 'react'
          }
          return 'vendor'
        }
      }
    },
    copyPublicDir: false,
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: 'hidden'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
