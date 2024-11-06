import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { User } from '@/users/domain/models/User'

export class AccountPageMockUserRepository extends UserJSDataverseRepository {
  getAuthenticated(): Promise<User> {
    return Promise.resolve({
      displayName: 'mockDisplayName',
      persistentId: 'mockPersistentId',
      firstName: 'mockFirstName',
      lastName: 'mockLastName',
      email: 'mockEmail',
      affiliation: 'mockAffiliation',
      superuser: true
    })
  }

  removeAuthenticated(): Promise<void> {
    return Promise.resolve()
  }

  getCurrentApiToken(): Promise<TokenInfo> {
    return Promise.resolve({
      apiToken: 'mock api token',
      expirationDate: new Date()
    })
  }

  recreateApiToken(): Promise<TokenInfo> {
    return Promise.resolve({
      apiToken: 'updated mock api token',
      expirationDate: new Date()
    })
  }

  deleteApiToken(): Promise<void> {
    return Promise.resolve()
  }
}
