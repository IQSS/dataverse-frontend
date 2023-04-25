import { User } from '../models/User'
import { UserRepository } from '../repositories/UserRepository'

export function getUser(userRepository: UserRepository): Promise<User | void> {
  return userRepository.getAuthenticated()
}
