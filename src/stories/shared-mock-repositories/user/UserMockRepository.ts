import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { User } from '@/users/domain/models/User'
import { UserMother } from '@tests/component/users/domain/models/UserMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { UserDTO } from '@/users/domain/useCases/DTOs/UserDTO'

export class UserMockRepository extends UserJSDataverseRepository {
  getAuthenticated(): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(UserMother.create())
      }, FakerHelper.loadingTimout())
    })
  }

  getCurrentApiToken(): Promise<TokenInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          apiToken: 'mock api token',
          expirationDate: new Date()
        })
      }, FakerHelper.loadingTimout())
    })
  }

  recreateApiToken(): Promise<TokenInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          apiToken: 'updated mock api token',
          expirationDate: new Date()
        })
      }, FakerHelper.loadingTimout())
    })
  }

  deleteApiToken(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }

  register(_user: UserDTO): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
}
