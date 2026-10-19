import { UserMockRepository } from './UserMockRepository'
import { SignUpResult } from '@/users/domain/models/SignUpResult'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { User } from '@/users/domain/models/User'

export class UserMockLoadingRepository extends UserMockRepository {
  getAuthenticated(): Promise<User> {
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

  register(): Promise<void> {
    return new Promise(() => {})
  }

  signUp(): Promise<SignUpResult> {
    return new Promise(() => {})
  }
}
