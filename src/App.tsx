import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { Router } from './Router'
import { SessionProvider } from './sections/session/SessionProvider'
import { UserJSDataverseRepository } from './users/infrastructure/repositories/UserJSDataverseRepository'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'

const VITE_DATAVERSE_BACKEND_URL = (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''
if (VITE_DATAVERSE_BACKEND_URL) {
  ApiConfig.init(`${VITE_DATAVERSE_BACKEND_URL}/api/v1`, DataverseApiAuthMechanism.SESSION_COOKIE)
} else {
  throw Error('VITE_DATAVERSE_BACKEND_URL environment variable should be specified.')
}

const userRepository = new UserJSDataverseRepository()
function App() {
  return (
    <SessionProvider repository={userRepository}>
      <Router />
    </SessionProvider>
  )
}

export default App
