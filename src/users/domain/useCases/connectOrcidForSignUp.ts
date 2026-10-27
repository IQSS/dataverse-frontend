import { UserRepository } from '../repositories/UserRepository'
import { OrcidSignUpCallbackDTO } from './DTOs/OrcidSignUpCallbackDTO'
import { OrcidSignUpConnection } from '../models/OrcidSignUpConnection'

export function connectOrcidForSignUp(
  userRepository: UserRepository,
  callback: OrcidSignUpCallbackDTO
): Promise<OrcidSignUpConnection> {
  return userRepository.connectOrcidForSignUp(callback)
}
