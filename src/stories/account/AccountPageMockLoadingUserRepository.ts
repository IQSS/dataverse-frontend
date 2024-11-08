import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { User } from '@/users/domain/models/User'

export class AccountPageMockLoadingUserRepository extends UserJSDataverseRepository {
  getAuthenticated(): Promise<User> {
    return new Promise(() => {})
  }

  removeAuthenticated(): Promise<void> {
    return new Promise(() => {})
  }

  getCurrentApiToken(): Promise<TokenInfo> {
    return new Promise(() => {})
  }

  recreateApiToken(): Promise<TokenInfo> {
    return new Promise(() => {})
  }

  deleteApiToken(): Promise<void> {
    return new Promise(() => {})
  }
}
