import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { KcPage, type KcContext } from './keycloak-theme/kc.gen'

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase
/*
import { getKcContextMock } from "./login/KcPageStory";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "register.ftl",
        overrides: {}
    });
}
*/
// TODO:ME - Using a component Library https://docs.keycloakify.dev/common-use-case-examples/using-a-component-library
// TODO:ME - Loading the JAR File into Keycloak https://docs.keycloakify.dev/deploying-your-theme
// TODO:ME - Maybe change the name of this file and maybe place the conditional App or KcPage in same index.tsx, dont know yet.
// TODO:ME - Environment Variables https://docs.keycloakify.dev/features/environment-variables

// I followed the instructions here: https://docs.keycloakify.dev/integration-keycloakify-in-your-codebase/vite.
// Also you need to have maven installed on your machine to be able to build the theme and generate the jar.
createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    {!window.kcContext ? <h1>No Keycloak Context</h1> : <KcPage kcContext={window.kcContext} />}
  </StrictMode>
)

declare global {
  interface Window {
    kcContext?: KcContext
  }
}
