import { UserRepository } from '../repositories/UserRepository'
import { SignUpDTO } from './DTOs/SignUpDTO'
import { SignUpResult } from '../models/SignUpResult'

export function signUp(
  userRepository: UserRepository,
  signUpDTO: SignUpDTO
): Promise<SignUpResult> {
  return userRepository.signUp(signUpDTO)
}
