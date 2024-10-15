import { useContext, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from 'react-oauth2-code-pkce'
import { AppLoader } from '../sections/shared/layout/app-loader/AppLoader'
import { encodeReturnToPathInStateQueryParam } from '@/sections/auth-callback/AuthCallback'

/**
 * This component is responsible for protecting routes that require authentication.
 * If we dont have a token, we redirect the user to the OIDC login page with the current pathname as a state parameter.
 * This state parameter is used to redirect the user back to their former intended pathname after the OIDC login is complete.
 */

export const ProtectedRoute = () => {
  const { pathname, search } = useLocation()
  const { token, loginInProgress, logIn: oidcLogin } = useContext(AuthContext)

  useEffect(() => {
    if (loginInProgress) return

    if (!token) {
      const state = encodeReturnToPathInStateQueryParam(`${pathname}${search}`)

      oidcLogin(state)
    }
  }, [token, oidcLogin, pathname, loginInProgress, search])

  if (loginInProgress) {
    return <AppLoader />
  }

  return <Outlet />
}
