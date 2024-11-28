import { User } from '../../domain/models/User'
import { TokenInfo } from '../../domain/models/TokenInfo'
import { UserRepository } from '../../domain/repositories/UserRepository'
import {
  AuthenticatedUser,
  getCurrentAuthenticatedUser,
  getCurrentApiToken,
  recreateCurrentApiToken,
  deleteCurrentApiToken
} from '@iqss/dataverse-client-javascript/dist/users'
import { logout, ReadError, WriteError } from '@iqss/dataverse-client-javascript'

interface ApiTokenInfoPayload {
  apiToken: string
  expirationDate: Date
}

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
          affiliation: authenticatedUser.affiliation,
          superuser: authenticatedUser.superuser
        }
      })
      .catch((error: ReadError) => {
        throw error
      })
  }

  removeAuthenticated(): Promise<void> {
    return logout.execute().catch((error: WriteError) => {
      throw new Error(error.message)
    })
  }

  getCurrentApiToken(): Promise<TokenInfo> {
    return getCurrentApiToken.execute().then((apiTokenInfo: ApiTokenInfoPayload) => {
      return {
        apiToken: apiTokenInfo.apiToken,
        expirationDate: apiTokenInfo.expirationDate
      }
    })
  }

  recreateApiToken(): Promise<TokenInfo> {
    return recreateCurrentApiToken.execute().then((apiTokenInfo: ApiTokenInfoPayload) => {
      return {
        apiToken: apiTokenInfo.apiToken,
        expirationDate: apiTokenInfo.expirationDate
      }
    })
  }

  deleteApiToken(): Promise<void> {
    return deleteCurrentApiToken.execute()
  }
}
