import { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from 'react-oauth2-code-pkce'
import { QueryParamKey } from '../Route.enum'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'

/**
 * This component will we rendered as redirectUri page after the OIDC login is complete.
 * It will redirect the user to the intended page before the OIDC login was initiated.
 * If the state parameter is not present, the user will be redirected to the homepage.
 */

export const AuthCallback = () => {
  const navigate = useNavigate()
  const { loginInProgress } = useContext(AuthContext)
  const [searchParams] = useSearchParams()

  const stateQueryParam = searchParams.get(QueryParamKey.AUTH_STATE)

  useEffect(() => {
    if (loginInProgress) return

    if (!stateQueryParam) {
      navigate('/', { replace: true })
      return
    }

    navigate(decodeURIComponent(stateQueryParam), { replace: true })
  }, [stateQueryParam, navigate, loginInProgress])

  return <AppLoader />
}
