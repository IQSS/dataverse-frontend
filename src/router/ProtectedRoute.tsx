import { useContext, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from 'react-oauth2-code-pkce'
import { AppLoader } from '../sections/shared/layout/app-loader/AppLoader'
import { encodeReturnToPathInStateQueryParam } from '@/sections/auth-callback/AuthCallback'
import { useSession } from '@/sections/session/SessionContext'

/**
 * This component is responsible for protecting routes that require authentication.
 * If we dont have a token, we redirect the user to the OIDC login page with the current pathname as a state parameter.
 * This state parameter is used to redirect the user back to their former intended pathname after the OIDC login is complete.
 */

export const ProtectedRoute = () => {
  const { pathname, search } = useLocation()
  const { token, loginInProgress: oidcLoginInProgress, logIn: oidcLogin } = useContext(AuthContext)
  const { user, isLoadingUser } = useSession()

  // We only show the loader if we dont have a token neither a user and we are in the process of logging in or loading the user data.
  const showLoader = !token && !user && (oidcLoginInProgress || isLoadingUser)

  useEffect(() => {
    if (oidcLoginInProgress || isLoadingUser) return

    if (!token) {
      const state = encodeReturnToPathInStateQueryParam(`${pathname}${search}`)

      oidcLogin(state)
    }
  }, [token, oidcLogin, oidcLoginInProgress, isLoadingUser, pathname, search])

  if (showLoader) {
    return <AppLoader />
  }

  return <Outlet />
}
