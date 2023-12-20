import { PropsWithChildren, useEffect, useState } from 'react'
import { User } from '../../users/domain/models/User'
import { SessionContext } from './SessionContext'
import { getUser } from '../../users/domain/useCases/getUser'
import { UserRepository } from '../../users/domain/repositories/UserRepository'
import { logOut } from '../../users/domain/useCases/logOut'

interface SessionProviderProps {
  repository: UserRepository
}
export function SessionProvider({ repository, children }: PropsWithChildren<SessionProviderProps>) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getUser(repository)
      .then((user: User | void) => {
        user && setUser(user)
      })
      .catch((error) => console.error('There was an error getting the authenticated user', error))
  }, [repository])

  const submitLogOut = () => {
    return logOut(repository)
      .then(() => {
        setUser(null)
      })
      .catch((error) => console.error('There was an error logging out the user', error))
  }

  return (
    <SessionContext.Provider value={{ user, setUser, logout: submitLogOut }}>
      {children}
    </SessionContext.Provider>
  )
}
