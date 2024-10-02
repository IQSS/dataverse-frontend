import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { Router } from './router'
import { SessionProvider } from './sections/session/SessionProvider'
import { UserJSDataverseRepository } from './users/infrastructure/repositories/UserJSDataverseRepository'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { BASE_URL } from './config'
import 'react-loading-skeleton/dist/skeleton.css'

if (BASE_URL === '') {
  throw Error('BASE_URL variable failed to initialize.')
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
