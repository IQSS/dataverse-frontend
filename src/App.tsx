import { AuthProvider, TAuthConfig } from 'react-oauth2-code-pkce'
import { ToastContainer } from 'react-toastify'
import { Router } from './router'
import { Route } from './sections/Route.enum'
import { requireAppConfig } from './config'
import { ExternalToolsProvider } from './shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsJSDataverseRepository } from './externalTools/infrastructure/repositories/ExternalToolsJSDataverseRepository'
import { RepositoriesProvider } from './shared/contexts/repositories/RepositoriesProvider'
import { CollectionJSDataverseRepository } from './collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { DatasetJSDataverseRepository } from './dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { FileJSDataverseRepository } from './files/infrastructure/FileJSDataverseRepository'
import { GuestbookJSDataverseRepository } from './guestbooks/infrastructure/repositories/GuestbookJSDataverseRepository'
import { UserJSDataverseRepository } from './users/infrastructure/repositories/UserJSDataverseRepository'
import 'react-loading-skeleton/dist/skeleton.css'
import './assets/global.scss'
import './assets/react-toastify-custom.scss'
import './assets/swal-custom.scss'

const externalToolsRepository = new ExternalToolsJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()
const guestbookRepository = new GuestbookJSDataverseRepository()
const userRepository = new UserJSDataverseRepository()

function App() {
  const appConfig = requireAppConfig()
  const origin = window.location.origin
  const BASENAME_URL = import.meta.env.BASE_URL ?? ''

  const authConfig: TAuthConfig = {
    clientId: appConfig.oidc.clientId,
    authorizationEndpoint: appConfig.oidc.authorizationEndpoint,
    tokenEndpoint: appConfig.oidc.tokenEndpoint,
    logoutEndpoint: appConfig.oidc.logoutEndpoint,
    storageKeyPrefix: appConfig.oidc.localStorageKeyPrefix,
    logoutRedirect: `${origin}${BASENAME_URL}`,
    redirectUri: `${origin}${BASENAME_URL}${Route.AUTH_CALLBACK}`,
    scope: 'openid',
    autoLogin: false,
    clearURL: false
  }

  return (
    <>
      <AuthProvider authConfig={authConfig}>
        <RepositoriesProvider
          collectionRepository={collectionRepository}
          datasetRepository={datasetRepository}
          externalToolsRepository={externalToolsRepository}
          fileRepository={fileRepository}
          guestbookRepository={guestbookRepository}
          userRepository={userRepository}>
          <ExternalToolsProvider>
            <Router />
          </ExternalToolsProvider>
        </RepositoriesProvider>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover />
    </>
  )
}

export default App
