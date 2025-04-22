import React from 'react'
import App from './App'
import './i18n'
import { LoadingProvider } from './sections/loading/LoadingProvider'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { AppLoader } from './sections/shared/layout/app-loader/AppLoader'

export default function AppEntrypoint() {
  return (
    <React.Suspense fallback={<AppLoader fullViewport />}>
      <LoadingProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </LoadingProvider>
    </React.Suspense>
  )
}
