import { User } from '../domain/User'
import { AuthenticatedUser, getCurrentAuthenticatedUser } from 'js-dataverse/dist/users'
import { ReadError } from 'js-dataverse/dist/core'
import { logout, WriteError } from 'js-dataverse'

export class UserJsDataverseRepository {
  get(): Promise<User | void> {
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
