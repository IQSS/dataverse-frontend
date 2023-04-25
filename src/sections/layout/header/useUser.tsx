import { UserRepository } from '../../../users/domain/repositories/UserRepository'
import { User } from '../../../users/domain/models/User'
import { useEffect, useState } from 'react'
import { getUser } from '../../../users/domain/useCases/getUser'
import { logOut } from '../../../users/domain/useCases/logOut'

export function useUser(repository: UserRepository) {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    getUser(repository)
      .then((user: User | void) => {
        user && setUser(user)
      })
      .catch((error) => console.error('There was an error getting the authenticated user', error))
  }, [repository])

  const submitLogOut = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    logOut(repository)
      .then(() => {
        setUser(undefined)
      })
      .catch((error) => console.error('There was an error removing the authenticated user', error))
  }

  return { user, submitLogOut }
}
