import { useState } from 'react'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { signUp } from '@/users/domain/useCases/signUp'
import { SignUpResult } from '@/users/domain/models/SignUpResult'
import { SignUpError } from '@/users/domain/models/SignUpError'
import { SignUpDTO } from '@/users/domain/useCases/DTOs/SignUpDTO'

export enum SignUpStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  Succeeded = 'Succeeded',
  Errored = 'Errored'
}

interface UseSignUpReturnType {
  status: SignUpStatus
  result: SignUpResult | null
  submitError: string | null
  submit: (signUpDTO: SignUpDTO) => Promise<void>
}

export const useSignUp = (
  userRepository: UserRepository,
  onFieldErrors: (fieldErrors: Record<string, string>) => void,
  onError: () => void
): UseSignUpReturnType => {
  const [status, setStatus] = useState<SignUpStatus>(SignUpStatus.NotSubmitted)
  const [result, setResult] = useState<SignUpResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submit = async (signUpDTO: SignUpDTO): Promise<void> => {
    setStatus(SignUpStatus.IsSubmitting)
    setSubmitError(null)

    try {
      const signUpResult = await signUp(userRepository, signUpDTO)
      setResult(signUpResult)
      setStatus(SignUpStatus.Succeeded)
    } catch (error) {
      if (error instanceof SignUpError) {
        onFieldErrors(error.fieldErrors)
        setSubmitError(error.message)
      } else {
        setSubmitError(error instanceof Error ? error.message : String(error))
      }
      setStatus(SignUpStatus.Errored)
      onError()
    }
  }

  return { status, result, submitError, submit }
}
