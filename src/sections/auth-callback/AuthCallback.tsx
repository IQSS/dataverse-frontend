import { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from 'react-oauth2-code-pkce'
import { QueryParamKey } from '../Route.enum'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'

export type AuthStateQueryParamValue = { returnTo: string }

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

    const returnToPath = decodeReturnToPathFromStateQueryParam(stateQueryParam)

    navigate(returnToPath, { replace: true })
  }, [stateQueryParam, navigate, loginInProgress])

  return <AppLoader />
}

export const encodeReturnToPathInStateQueryParam = (returnToPath: string): string => {
  const returnToObject: AuthStateQueryParamValue = { returnTo: returnToPath }

  return encodeURIComponent(JSON.stringify(returnToObject))
}

export const decodeReturnToPathFromStateQueryParam = (stateQueryParam: string): string => {
  const decodedStateQueryParam = decodeURIComponent(stateQueryParam)
  const parsedStateQueryParam = JSON.parse(decodedStateQueryParam) as unknown

  if (isReturnToObject(parsedStateQueryParam)) {
    return parsedStateQueryParam.returnTo
  }

  return '/'
}

function isReturnToObject(obj: unknown): obj is AuthStateQueryParamValue {
  return (
    obj !== null && typeof obj === 'object' && 'returnTo' in obj && typeof obj.returnTo === 'string'
  )
}
