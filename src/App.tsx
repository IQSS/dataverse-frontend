import { ApiConfig } from 'js-dataverse/dist/core'
import { Router } from './Router'

const VITE_DATAVERSE_BACKEND_URL = (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''
if (VITE_DATAVERSE_BACKEND_URL) {
  ApiConfig.init(`${VITE_DATAVERSE_BACKEND_URL}/api/v1`)
} else {
  throw Error('VITE_DATAVERSE_BACKEND_URL environment variable should be specified.')
}

function App() {
  return <Router />
}

export default App
