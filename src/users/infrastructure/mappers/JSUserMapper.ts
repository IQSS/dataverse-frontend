import { User } from '@/users/domain/models/User'
import { AuthenticatedUser } from '@iqss/dataverse-client-javascript'

export class JSUserMapper {
  static toUser(authenticatedUser: AuthenticatedUser): User {
    return {
      displayName: authenticatedUser.displayName,
      persistentId: authenticatedUser.persistentUserId,
      firstName: authenticatedUser.firstName,
      lastName: authenticatedUser.lastName,
      email: authenticatedUser.email,
      affiliation: authenticatedUser.affiliation,
      superuser: authenticatedUser.superuser,
      identifier: this.removeAtSymbol(authenticatedUser.identifier)
    }
  }

  static removeAtSymbol(identifier: string): string {
    return identifier.startsWith('@') ? identifier.slice(1) : identifier
  }
}
