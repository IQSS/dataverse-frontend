import { User } from '../../domain/models/User'
import { AuthenticatedUser, getCurrentAuthenticatedUser } from 'js-dataverse/dist/users'
import { ReadError } from 'js-dataverse/dist/core'
import { logout, WriteError } from 'js-dataverse'
import { UserRepository } from '../../domain/repositories/UserRepository'

export class UserJSDataverseRepository implements UserRepository {
  getAuthenticated(): Promise<User> {
    return getCurrentAuthenticatedUser
      .execute()
      .then((authenticatedUser: AuthenticatedUser) => {
        return { name: authenticatedUser.displayName }
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  removeAuthenticated(): Promise<void> {
    return logout.execute().catch((error: WriteError) => {
      throw new Error(error.message)
    })
  }
}
