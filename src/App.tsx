import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { Router } from './router'
import { SessionProvider } from './sections/session/SessionProvider'
import { UserJSDataverseRepository } from './users/infrastructure/repositories/UserJSDataverseRepository'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { BASE_URL } from './config'
import 'react-loading-skeleton/dist/skeleton.css'
import { AuthProvider, TAuthConfig } from 'react-oauth2-code-pkce'

if (BASE_URL === '') {
  throw Error('VITE_DATAVERSE_BACKEND_URL environment variable should be specified.')
} else {
  ApiConfig.init(`${BASE_URL}/api/v1`, DataverseApiAuthMechanism.SESSION_COOKIE)
}

const authConfig: TAuthConfig = {
  clientId: 'test',
  authorizationEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/token',
  logoutEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/logout',
  redirectUri: 'http://localhost:8000/spa',
  scope: 'openid',
  autoLogin: false
}

const userRepository = new UserJSDataverseRepository()
function App() {
  return (
    <AuthProvider authConfig={authConfig}>
      <SessionProvider repository={userRepository}>
        <Router />
      </SessionProvider>
    </AuthProvider>
  )
}

export default App
