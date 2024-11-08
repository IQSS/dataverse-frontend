import { TokenInfo } from '../models/TokenInfo'
import { UserRepository } from '../repositories/UserRepository'

export function getCurrentApiToken(userRepository: UserRepository): Promise<TokenInfo> {
  return userRepository.getCurrentApiToken()
}
