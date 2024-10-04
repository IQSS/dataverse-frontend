import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthContext } from 'react-oauth2-code-pkce'
import { AppLoader } from '../sections/shared/layout/app-loader/AppLoader'

export const ProtectedRoute = () => {
  const { token, loginInProgress, logIn } = useContext(AuthContext)

  if (loginInProgress) {
    return <AppLoader />
  }

  if (!token) {
    logIn()
  }

  return <Outlet />
}
