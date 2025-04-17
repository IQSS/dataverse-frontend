import { UserMockRepository } from './UserMockRepository'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { User } from '@/users/domain/models/User'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class UserMockErrorRepository extends UserMockRepository {
  getAuthenticated(): Promise<User> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong getting authentication. Try again later.')
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

  register(): Promise<void> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong registering the user. Try again later.')
      }, FakerHelper.loadingTimout())
    })
  }
}
