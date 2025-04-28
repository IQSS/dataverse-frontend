import { Suspense, lazy } from 'react'
import type { ClassKey } from 'keycloakify/login'
import type { KcContext } from './KcContext'
import { useI18n } from './i18n'
import DefaultPage from 'keycloakify/login/DefaultPage'
import './main.scss'

const UserProfileFormFields = lazy(() => import('keycloakify/login/UserProfileFormFields'))
const Login = lazy(() => import('./pages/Login'))
const CustomTemplate = lazy(() => import('./Template'))
const DefaultTemplate = lazy(() => import('keycloakify/login/Template'))

const doMakeUserConfirmPassword = true

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props

  const { i18n } = useI18n({ kcContext })

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
          case 'login.ftl':
            return (
              <Login
                {...{ kcContext, i18n, classes }}
                Template={CustomTemplate}
                doUseDefaultCss={false}
              />
            )
          default:
            return (
              <DefaultPage
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={DefaultTemplate}
                doUseDefaultCss={true}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            )
        }
      })()}
    </Suspense>
  )
}

const classes = {} satisfies { [key in ClassKey]?: string }
