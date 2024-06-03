import { User } from '../../domain/models/User'
import {
  AuthenticatedUser,
  getCurrentAuthenticatedUser
} from '@iqss/dataverse-client-javascript/dist/users'
import { logout, ReadError, WriteError } from '@iqss/dataverse-client-javascript'
import { UserRepository } from '../../domain/repositories/UserRepository'

export class UserJSDataverseRepository implements UserRepository {
  getAuthenticated(): Promise<User> {
    return getCurrentAuthenticatedUser
      .execute()
      .then((authenticatedUser: AuthenticatedUser) => {
        return {
          displayName: authenticatedUser.displayName,
          persistentId: authenticatedUser.persistentUserId,
          firstName: authenticatedUser.firstName,
          lastName: authenticatedUser.lastName,
          email: authenticatedUser.email,
          affiliation: authenticatedUser.affiliation
        }
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
