import { Outlet, useNavigate } from 'react-router-dom'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { User } from '../../users/domain/models/User'
import { SessionContext, SessionError } from './SessionContext'
import { getUser } from '../../users/domain/useCases/getUser'
import { UserRepository } from '../../users/domain/repositories/UserRepository'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { QueryParamKey, Route } from '../Route.enum'
import { ReadError } from '@iqss/dataverse-client-javascript'

export const BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE =
  'Bearer token is validated, but there is no linked user account.'

interface SessionProviderProps {
  repository: UserRepository
}

export function SessionProvider({ repository }: SessionProviderProps) {
  const navigate = useNavigate()
  const { token, loginInProgress } = useContext(AuthContext)
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [sessionError, setSessionError] = useState<SessionError | null>(null)

  const handleFetchError = useCallback(
    (err: unknown) => {
      if (err instanceof ReadError) {
        const readErrorHandler = new JSDataverseReadErrorHandler(err)
        const statusCode = readErrorHandler.getStatusCode()
        const errorMessage =
          readErrorHandler.getReasonWithoutStatusCode() ?? readErrorHandler.getErrorMessage()

        // Handle specific error: Bearer token validated, but no linked user account
        if (readErrorHandler.isBearerTokenValidatedButNoLinkedUserAccountError()) {
          setSessionError({ statusCode, message: errorMessage })

          // Redirect to the sign-up page with a query param
          navigate(
            `${Route.SIGN_UP}?${new URLSearchParams({
              [QueryParamKey.VALID_TOKEN_BUT_NOT_LINKED_ACCOUNT]: 'true'
            }).toString()}`
          )

          return
        }

        // Set session error for other ReadError cases
        setSessionError({ statusCode, message: errorMessage })
        return
      }

      // Handle unexpected errors
      setSessionError({
        statusCode: null,
        message: 'An unexpected error occurred while getting the user.'
      })
    },
    [navigate]
  )

  const fetchUser = useCallback(async () => {
    setIsLoadingUser(true)

    try {
      const user = await getUser(repository)
      setUser(user)
    } catch (err) {
      handleFetchError(err)
    } finally {
      setIsLoadingUser(false)
    }
  }, [repository, handleFetchError])

  const refetchUserSession = async () => {
    await fetchUser()
  }

  useEffect(() => {
    if (token && !loginInProgress) {
      void fetchUser()
    }
  }, [token, loginInProgress, fetchUser])

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoadingUser,
        sessionError,
        setUser,
        refetchUserSession
      }}>
      <Outlet />
    </SessionContext.Provider>
  )
}
