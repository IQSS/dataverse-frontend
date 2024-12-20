import { UserRepository } from '../repositories/UserRepository'
import { UserDTO } from './DTOs/UserDTO'

export function registerUser(userRepository: UserRepository, userDTO: UserDTO): Promise<void> {
  return userRepository.register(userDTO)
}
