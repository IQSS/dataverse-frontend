import { TokenInfo } from '../models/TokenInfo'
import { UserRepository } from '../repositories/UserRepository'

export function recreateApiToken(userRepository: UserRepository): Promise<TokenInfo> {
  return userRepository.recreateApiToken()
}
