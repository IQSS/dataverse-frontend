import { Outlet, useNavigate } from 'react-router-dom'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { User } from '../../users/domain/models/User'
import { SessionContext, SessionError } from './SessionContext'
import { getUser } from '../../users/domain/useCases/getUser'
import { UserRepository } from '../../users/domain/repositories/UserRepository'
import { logOut } from '../../users/domain/useCases/logOut'
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

  // TODO:ME - Ask how to handle when user doesn't want to sign up, save in memory to avoid redirecting it again. Next time ask with an alert?
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

  const submitLogOut = async () => {
    try {
      await logOut(repository)
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  useEffect(() => {
    if (token && !loginInProgress) {
      void fetchUser()
    }
  }, [repository, token, loginInProgress, navigate, fetchUser])

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoadingUser,
        sessionError,
        setUser,
        logout: submitLogOut,
        refetchUserSession
      }}>
      <Outlet />
    </SessionContext.Provider>
  )
}

// export function SessionProvider({ repository }: SessionProviderProps) {
//   const { token, loginInProgress } = useContext(AuthContext)
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const handleGetUser = async () => {
//       setIsLoadingUser(true)
//       try {
//         const user: User = await getUser(repository)

//         user && setUser(user)
//       } catch (err: unknown) {
//         if (JSDataverseReadErrorHandler.isBearerTokenValidatedButNoLinkedUserAccountError(err)) {
//           const searchParams = new URLSearchParams()
//           searchParams.set(QueryParamKey.VALID_TOKEN_BUT_NOT_LINKED_ACCOUNT, 'true')

//           navigate(`${Route.SIGN_UP}?${searchParams.toString()}`)
//         }
//         // TODO:ME - Handle another type of error
//         // TODO:ME - Ask how to handle when user doesn't want to sign up, save in memory to avoid redirecting it again. Next time ask with an alert?
//       } finally {
//         setIsLoadingUser(false)
//       }
//     }

//     if (token && !loginInProgress) {
//       void handleGetUser()
//     }
//   }, [repository, token, loginInProgress, navigate])

//   const refetchUser = () => {
//     setIsLoadingUser(true)

//     getUser(repository)
//       .then((user) => {
//         setUser(user)
//       })
//       .catch((error) => console.error('There was an error fetching the user', error))
//       .finally(() => setIsLoadingUser(false))
//   }

//   const submitLogOut = () => {
//     return logOut(repository)
//       .then(() => {
//         setUser(null)
//       })
//       .catch((error) => console.error('There was an error logging out the user', error))
//   }

//   return (
//     <SessionContext.Provider
//       value={{ user, isLoadingUser, setUser, logout: submitLogOut, refetchUser }}>
//       <Outlet />
//     </SessionContext.Provider>
//   )
// }
