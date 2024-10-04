import { Outlet } from 'react-router-dom'
import { Route } from '../sections/Route.enum'
import { useSession } from '../sections/session/SessionContext'
import { AppLoader } from '../sections/shared/layout/app-loader/AppLoader'
import { BASE_URL } from '../config'

export const ProtectedRoute = () => {
  const { user, isLoadingUser } = useSession()

  console.log({ user })

  if (isLoadingUser) {
    return <AppLoader />
  }

  if (!user) {
    window.location.href = `${BASE_URL}${Route.LOG_IN}`
    return null
  }

  // When we have the login page inside the SPA, we can use the following code:
  // return !user ? <Navigate to="/login" replace /> : <Outlet />

  return <Outlet />
}
