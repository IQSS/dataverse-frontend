import { createRoot } from 'react-dom/client'
import { lazy, StrictMode, Suspense } from 'react'
import { KcPage } from './keycloak-theme/kc.gen'
const AppEntrypoint = lazy(() => import('./index.app'))

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
