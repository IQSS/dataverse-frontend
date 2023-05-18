import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './i18n'
import { LoadingProvider } from './sections/loading/LoadingProvider'
import { ThemeProvider } from 'dataverse-design-system'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <LoadingProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </LoadingProvider>
    </React.Suspense>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
