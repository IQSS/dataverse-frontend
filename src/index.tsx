import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n'
import { LoadingProvider } from './sections/loading/LoadingProvider'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { AppLoader } from './sections/shared/layout/app-loader/AppLoader'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<AppLoader fullViewport />}>
      <LoadingProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </LoadingProvider>
    </React.Suspense>
  </React.StrictMode>
)
