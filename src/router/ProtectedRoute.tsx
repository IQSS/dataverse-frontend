import { BASE_URL } from '../config'
import { Route } from '../sections/Route.enum'
import { useSession } from '../sections/session/SessionContext'
import { Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const { user, isLoadingUser } = useSession()

  if (isLoadingUser) {
    //TODO:ME Show app loader here
    return null
  }

  if (!user) {
    window.location.href = `${BASE_URL}${Route.LOG_IN}`
    return null
  }

  // TODO: When we have the login page within the SPA, we can use the following code:
  // return !user ? <Navigate to="/login" replace /> : <Outlet />

  return <Outlet />
}
