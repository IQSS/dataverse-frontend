import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { Router } from './Router'
import { SessionProvider } from './sections/session/SessionProvider'
import { UserJSDataverseRepository } from './users/infrastructure/repositories/UserJSDataverseRepository'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { BASE_URL } from './config'

if (BASE_URL === '') {
  throw Error('VITE_DATAVERSE_BACKEND_URL environment variable should be specified.')
} else {
  ApiConfig.init(`${BASE_URL}/api/v1`, DataverseApiAuthMechanism.SESSION_COOKIE)
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
