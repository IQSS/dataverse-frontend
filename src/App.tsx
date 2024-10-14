import { AuthProvider, TAuthConfig, TRefreshTokenExpiredEvent } from 'react-oauth2-code-pkce'
import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { Router } from './router'
import { SessionProvider } from './sections/session/SessionProvider'
import { UserJSDataverseRepository } from './users/infrastructure/repositories/UserJSDataverseRepository'
import { Route } from './sections/Route.enum'
import { DATAVERSE_BACKEND_URL } from './config'
import 'react-loading-skeleton/dist/skeleton.css'

if (DATAVERSE_BACKEND_URL === '') {
  throw Error('VITE_DATAVERSE_BACKEND_URL environment variable should be specified.')
} else {
  ApiConfig.init(`${DATAVERSE_BACKEND_URL}/api/v1`, DataverseApiAuthMechanism.BEARER_TOKEN)
}

const origin = window.location.origin
const BASENAME_URL = import.meta.env.BASE_URL ?? ''

const authConfig: TAuthConfig = {
  clientId: 'test',
  authorizationEndpoint: `${origin}/realms/test/protocol/openid-connect/auth`,
  tokenEndpoint: `${origin}/realms/test/protocol/openid-connect/token`,
  logoutEndpoint: `${origin}/realms/test/protocol/openid-connect/logout`,
  logoutRedirect: `${origin}${BASENAME_URL}`,
  redirectUri: `${origin}${BASENAME_URL}${Route.AUTH_CALLBACK}`,
  scope: 'openid',
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) =>
    event.logIn(undefined, undefined, 'popup'),
  autoLogin: false,
  clearURL: false
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
