import { useState } from 'react'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { signUp } from '@/users/domain/useCases/signUp'
import { SignUpResult } from '@/users/domain/models/SignUpResult'
import { SignUpError } from '@/users/domain/models/SignUpError'
import { SignUpDTO } from '@/users/domain/useCases/DTOs/SignUpDTO'
import { logInWithPassword } from './logInWithPassword'

export enum SignUpStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  Succeeded = 'Succeeded',
  Errored = 'Errored'
}

interface UseSignUpReturnType {
  status: SignUpStatus
  result: SignUpResult | null
  isLoggedIn: boolean
  submitError: string | null
  submit: (signUpDTO: SignUpDTO) => Promise<void>
}

const tryLogIn = async (username: string, password: string): Promise<boolean> => {
  try {
    await logInWithPassword(username, password)
    return true
  } catch {
    return false
  }
}

export const useSignUp = (
  userRepository: UserRepository,
  onFieldErrors: (fieldErrors: Record<string, string>) => void,
  onError: () => void
): UseSignUpReturnType => {
  const [status, setStatus] = useState<SignUpStatus>(SignUpStatus.NotSubmitted)
  const [result, setResult] = useState<SignUpResult | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submit = async (signUpDTO: SignUpDTO): Promise<void> => {
    setStatus(SignUpStatus.IsSubmitting)
    setSubmitError(null)

    let signUpResult: SignUpResult
    try {
      signUpResult = await signUp(userRepository, signUpDTO)
    } catch (error) {
      if (error instanceof SignUpError) {
        onFieldErrors(error.fieldErrors)
        setSubmitError(error.message)
      } else {
        setSubmitError(error instanceof Error ? error.message : String(error))
      }
      setStatus(SignUpStatus.Errored)
      onError()
      return
    }

    if (signUpResult.status === 'created') {
      setIsLoggedIn(await tryLogIn(signUpDTO.username, signUpDTO.password))
    }
    setResult(signUpResult)
    setStatus(SignUpStatus.Succeeded)
  }

  return { status, result, isLoggedIn, submitError, submit }
}
