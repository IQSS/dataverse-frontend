import { createRoot } from 'react-dom/client'
import { lazy, StrictMode, Suspense } from 'react'
import { KcPage } from './keycloak-theme/kc.gen'
const AppEntrypoint = lazy(() => import('./index.app'))

// TODO:ME - Run docker build with keycloak for docker also, so we build everything in one command.
// TODO:ME - Environment Variables https://docs.keycloakify.dev/features/environment-variables

// I followed the instructions here: https://docs.keycloakify.dev/integration-keycloakify-in-your-codebase/vite.
// Also you need to have maven installed on your machine to be able to build the theme and generate the jar.
createRoot(document.getElementById('root') as HTMLElement).render(
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
