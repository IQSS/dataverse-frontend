import { User } from '../../domain/models/User'
import { AuthenticatedUser, getCurrentAuthenticatedUser } from 'js-dataverse/dist/users'
import { ReadError } from 'js-dataverse/dist/core'
import { logout, WriteError } from 'js-dataverse'
import { UserRepository } from '../../domain/repositories/UserRepository'

export class UserJsDataverseRepository implements UserRepository {
  getAuthenticated(): Promise<User | void> {
    return getCurrentAuthenticatedUser
      .execute()
      .then((authenticatedUser: AuthenticatedUser) => {
        return { name: authenticatedUser.displayName }
      })
      .catch((error: ReadError) => {
        console.log(error.message)
      })
  }

  removeAuthenticated(): Promise<void> {
    return logout.execute().catch((error: WriteError) => {
      console.log(error.message)
    })
  }
}
