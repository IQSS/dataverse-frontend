import { Outlet, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { User } from '../../users/domain/models/User'
import { SessionContext } from './SessionContext'
import { getUser } from '../../users/domain/useCases/getUser'
import { UserRepository } from '../../users/domain/repositories/UserRepository'
import { logOut } from '../../users/domain/useCases/logOut'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { QueryParamKey, Route } from '../Route.enum'

export const BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE =
  'Bearer token is validated, but there is no linked user account.'

interface SessionProviderProps {
  repository: UserRepository
}
export function SessionProvider({ repository }: SessionProviderProps) {
  const { token, loginInProgress } = useContext(AuthContext)
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetUser = async () => {
      setIsLoadingUser(true)
      try {
        const user: User = await getUser(repository)

        user && setUser(user)
      } catch (err: unknown) {
        if (JSDataverseReadErrorHandler.isBearerTokenValidatedButNoLinkedUserAccountError(err)) {
          const searchParams = new URLSearchParams()
          searchParams.set(QueryParamKey.VALID_TOKEN_BUT_NOT_LINKED_ACCOUNT, 'true')

          navigate(`${Route.SIGN_UP}?${searchParams.toString()}`)
        }
        // TODO:ME - Handle another type of error
        // TODO:ME - Ask how to handle when user doesn't want to sign up, save in memory to avoid redirecting it again. Next time ask with an alert?
      } finally {
        setIsLoadingUser(false)
      }
    }

    if (token && !loginInProgress) {
      void handleGetUser()
    }
  }, [repository, token, loginInProgress, navigate])

  const submitLogOut = () => {
    return logOut(repository)
      .then(() => {
        setUser(null)
      })
      .catch((error) => console.error('There was an error logging out the user', error))
  }

  return (
    <SessionContext.Provider value={{ user, isLoadingUser, setUser, logout: submitLogOut }}>
      <Outlet />
    </SessionContext.Provider>
  )
}
