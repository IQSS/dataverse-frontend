import { UserRepository } from '../repositories/UserRepository'
import { User } from '../models/User'

export function logOut(userRepository: UserRepository): Promise<User | void> {
  return userRepository.removeAuthenticated()
}
