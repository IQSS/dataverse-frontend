import { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { User } from '../../users/domain/models/User'
import { SessionContext } from './SessionContext'
import { getUser } from '../../users/domain/useCases/getUser'
import { UserRepository } from '../../users/domain/repositories/UserRepository'
import { logOut } from '../../users/domain/useCases/logOut'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

export const BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE =
  'Bearer token is validated, but there is no linked user account.'

interface SessionProviderProps {
  repository: UserRepository
}
export function SessionProvider({ repository, children }: PropsWithChildren<SessionProviderProps>) {
  const { token, loginInProgress } = useContext(AuthContext)
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false)

  useEffect(() => {
    const handleGetUser = async () => {
      setIsLoadingUser(true)
      try {
        const user: User = await getUser(repository)

        user && setUser(user)
      } catch (err: unknown) {
        if (JSDataverseReadErrorHandler.isBearerTokenValidatedButNoLinkedUserAccountError(err)) {
          alert('Redirect the user to the registration page to fully create the user account.')
          console.log(
            'Redirect the user to the registration page to fully create the user account.'
          )
        }
        // TODO:ME - Handle another type of error
      } finally {
        setIsLoadingUser(false)
      }
    }

    if (token && !loginInProgress) {
      void handleGetUser()
    }
  }, [repository, token, loginInProgress])

  const submitLogOut = () => {
    return logOut(repository)
      .then(() => {
        setUser(null)
      })
      .catch((error) => console.error('There was an error logging out the user', error))
  }

  return (
    <SessionContext.Provider value={{ user, isLoadingUser, setUser, logout: submitLogOut }}>
      {children}
    </SessionContext.Provider>
  )
}
