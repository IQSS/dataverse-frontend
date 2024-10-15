import { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { User } from '../../users/domain/models/User'
import { SessionContext } from './SessionContext'
import { getUser } from '../../users/domain/useCases/getUser'
import { UserRepository } from '../../users/domain/repositories/UserRepository'
import { logOut } from '../../users/domain/useCases/logOut'

interface SessionProviderProps {
  repository: UserRepository
}
export function SessionProvider({ repository, children }: PropsWithChildren<SessionProviderProps>) {
  const { token, loginInProgress } = useContext(AuthContext)
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true)

  useEffect(() => {
    const handleGetUser = async () => {
      setIsLoadingUser(true)
      try {
        const user: User | void = await getUser(repository)

        user && setUser(user)
      } catch (error) {
        console.error('There was an error getting the authenticated user', error)
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
