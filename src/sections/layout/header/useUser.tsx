import { UserRepository } from '../../../domain/UserRepository'
import { User } from '../../../domain/User'
import { useEffect, useState } from 'react'

export function useUser(repository: UserRepository) {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    repository
      .getAuthenticated()
      .then((user: User | void) => {
        user && setUser(user)
      })
      .catch((error) => console.error('There was an error getting the authenticated user', error))
  }, [repository])

  const logOut = () => {
    repository
      .removeAuthenticated()
      .then(() => {
        setUser(undefined)
      })
      .catch((error) => console.error('There was an error removing the authenticated user', error))
  }

  return { user, logOut }
}
