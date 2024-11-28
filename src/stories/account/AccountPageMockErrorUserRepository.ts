import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { User } from '@/users/domain/models/User'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class AccountPageMockErrorUserRepository extends UserJSDataverseRepository {
  getAuthenticated(): Promise<User> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong getting authentication. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }

  removeAuthenticated(): Promise<void> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong removing authentication. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }

  getCurrentApiToken(): Promise<TokenInfo> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong getting the current api token. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }

  recreateApiToken(): Promise<TokenInfo> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong creating the api token. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }

  deleteApiToken(): Promise<void> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong revoking the api token. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }
}
