import { UserRepository } from '../repositories/UserRepository'

export function revokeApiToken(userRepository: UserRepository): Promise<void> {
  return userRepository.deleteApiToken()
}
