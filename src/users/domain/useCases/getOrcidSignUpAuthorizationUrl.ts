import { UserRepository } from '../repositories/UserRepository'

export function getOrcidSignUpAuthorizationUrl(
  userRepository: UserRepository,
  redirectUri: string
): Promise<string> {
  return userRepository.getOrcidSignUpAuthorizationUrl(redirectUri)
}
