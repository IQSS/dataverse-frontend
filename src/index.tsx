import { createRoot } from 'react-dom/client'
import { lazy, StrictMode, Suspense } from 'react'
import { KcPage } from './keycloak-theme/kc.gen'
import { initAppConfig, requireAppConfig } from './config'
import { ConfigError } from './ConfigError'
import { ApiConfig } from '@iqss/dataverse-client-javascript'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'

const AppEntrypoint = lazy(() => import('./index.app'))

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

const appConfigInit = initAppConfig()

if (!appConfigInit.ok) {
  root.render(
    <ConfigError message={appConfigInit.message} schemaError={appConfigInit.schemaError} />
  )
} else {
  const appConfig = requireAppConfig()

  ApiConfig.init(
    `${appConfig.backendUrl}/api/v1`,
    DataverseApiAuthMechanism.BEARER_TOKEN,
    undefined,
    `${appConfig.oidc.localStorageKeyPrefix}token`
  )

  root.render(
    <StrictMode>
      {window.kcContext ? (
        <KcPage kcContext={window.kcContext} />
      ) : (
        <Suspense>
          <AppEntrypoint />
        </Suspense>
      )}
    </StrictMode>
  )
}
