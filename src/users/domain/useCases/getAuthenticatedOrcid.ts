import { UserRepository } from '../repositories/UserRepository'

export function getAuthenticatedOrcid(userRepository: UserRepository): Promise<string | null> {
  return userRepository.getAuthenticatedOrcid()
}
