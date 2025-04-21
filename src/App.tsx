import { AuthProvider, TAuthConfig } from 'react-oauth2-code-pkce'
import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { ToastContainer } from 'react-toastify'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { Router } from './router'
import { Route } from './sections/Route.enum'
import { OIDC_AUTH_CONFIG, DATAVERSE_BACKEND_URL } from './config'
import 'react-loading-skeleton/dist/skeleton.css'
import './assets/react-toastify-custom.scss'
import './assets/swal-custom.scss'

if (DATAVERSE_BACKEND_URL === '') {
  throw Error('VITE_DATAVERSE_BACKEND_URL environment variable should be specified.')
} else {
  ApiConfig.init(
    `${DATAVERSE_BACKEND_URL}/api/v1`,
    DataverseApiAuthMechanism.BEARER_TOKEN,
    undefined,
    `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
  )
}

if (Object.values(OIDC_AUTH_CONFIG).includes('')) {
  const missingEnv = Object.entries(OIDC_AUTH_CONFIG)
    .filter(([, value]) => value === '')
    .map(([key]) => key)
    .join(', ')

  throw Error(`The following environment variables should be specified: ${missingEnv}`)
}

const origin = window.location.origin
const BASENAME_URL = import.meta.env.BASE_URL ?? ''

const authConfig: TAuthConfig = {
  clientId: OIDC_AUTH_CONFIG.CLIENT_ID,
  authorizationEndpoint: OIDC_AUTH_CONFIG.AUTHORIZATION_ENDPOINT,
  tokenEndpoint: OIDC_AUTH_CONFIG.TOKEN_ENDPOINT,
  logoutEndpoint: OIDC_AUTH_CONFIG.LOGOUT_ENDPOINT,
  storageKeyPrefix: OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX,
  logoutRedirect: `${origin}${BASENAME_URL}`,
  redirectUri: `${origin}${BASENAME_URL}${Route.AUTH_CALLBACK}`,
  scope: 'openid',
  autoLogin: false,
  clearURL: false
}

function App() {
  return (
    <>
      <AuthProvider authConfig={authConfig}>
        <Router />
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover />
    </>
  )
}

export default App
