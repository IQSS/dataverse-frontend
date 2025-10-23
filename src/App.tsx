import { AuthProvider, TAuthConfig } from 'react-oauth2-code-pkce'
import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { ToastContainer } from 'react-toastify'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { Router } from './router'
import { Route } from './sections/Route.enum'
import { OIDC_AUTH_CONFIG, DATAVERSE_BACKEND_URL } from './config'
import { ExternalToolsProvider } from './shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsJSDataverseRepository } from './externalTools/infrastructure/repositories/ExternalToolsJSDataverseRepository'
import 'react-loading-skeleton/dist/skeleton.css'
import './assets/global.scss'
import './assets/react-toastify-custom.scss'
import './assets/swal-custom.scss'
import { CollectionJSDataverseRepository } from './collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { CollectionRepository } from './collection/domain/repositories/CollectionRepository'
import {
  RepositoriesProvider,
  useRepositories
} from './shared/contexts/repositories/RepositoriesProvider'
import { SearchJSRepository } from './search/infrastructure/repositories/SearchJSRepository'
import { useGetSearchServices } from './search/domain/hooks/useGetSearchServices'
import { ContactJSDataverseRepository } from './contact/infrastructure/ContactJSDataverseRepository'

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

const externalToolsRepository = new ExternalToolsJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()
const searchRepository = new SearchJSRepository()
const contactRepository = new ContactJSDataverseRepository()

function App() {
  return (
    <>
      <AuthProvider authConfig={authConfig}>
        <RepositoriesProvider
          collectionRepository={collectionRepository}
          searchRepository={searchRepository}
          contactRepository={contactRepository}>
          {/* <Component1 />
          <Component2 />
          <Component3 />
          <NestedComponent /> */}
          <ExternalToolsProvider externalToolsRepository={externalToolsRepository}>
            <Router />
          </ExternalToolsProvider>
        </RepositoriesProvider>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover />
    </>
  )
}

export default App

const Component1 = () => <div>Component 1</div>
const Component2 = () => <div>Component 2</div>
const Component3 = () => <div>Component 3</div>

const NestedComponent = () => (
  <div>
    Nested Component
    <AnotherNestedComponent />
  </div>
)

const AnotherNestedComponent = () => {
  return (
    <div>
      <p>Another Nested Component</p>
      <ThirdLevelNestedComponent />
    </div>
  )
}

const ThirdLevelNestedComponent = () => {
  // Get from a context the collection repository
  // I need to use a collection use case from the collection repository
  const { searchRepository } = useRepositories()

  const { searchServices } = useGetSearchServices({ searchRepository })

  console.log(searchServices)

  return (
    <div>
      <p>Third Level Nested Component</p>
    </div>
  )
}
