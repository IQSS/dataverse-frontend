import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type TTokenData } from 'react-oauth2-code-pkce/dist/types'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { UserDTO } from '@/users/domain/useCases/DTOs/UserDTO'
import { registerUser } from '@/users/domain/useCases/registerUser'
import { useSession } from '@/sections/session/SessionContext'
import { AccountHelper } from '@/sections/account/AccountHelper'
import { Route } from '@/sections/Route.enum'
import { ValidTokenNotLinkedAccountFormHelper } from './ValidTokenNotLinkedAccountFormHelper'
import { ValidTokenNotLinkedAccountFormData } from './types'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

type UseSubmitUserReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitForm: (formData: ValidTokenNotLinkedAccountFormData) => void
      submitError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitForm: (formData: ValidTokenNotLinkedAccountFormData) => void
      submitError: string
    }

export const useSubmitUser = (
  userRepository: UserRepository,
  onSubmitErrorCallback: () => void,
  tokenData?: TTokenData
): UseSubmitUserReturnType => {
  const { refetchUserSession } = useSession()
  const navigate = useNavigate()

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = (formData: ValidTokenNotLinkedAccountFormData): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    // We wont send properties that are already present in the tokenData, those are the disabled/readonly fields
    const registrationDTO: UserDTO =
      ValidTokenNotLinkedAccountFormHelper.defineRegistrationDTOProperties(formData, tokenData)

    // TODO:ME - Ask Guillermo, when sending username or preferred_username even if it is in tokenData the endpoint is not failing.
    // Also sending position property as 3 and not a string is ok?
    // Ask team about this, should not be merged to 6.5 until fixed

    registerUser(userRepository, registrationDTO)
      .then(async () => {
        setSubmitError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)

        await refetchUserSession()

        // Navigate to Account - Account Information tab after successful registration
        navigate(
          `${Route.ACCOUNT}?${AccountHelper.ACCOUNT_PANEL_TAB_QUERY_KEY}=${AccountHelper.ACCOUNT_PANEL_TABS_KEYS.accountInformation}`,
          {
            state: { accountCreated: true },
            replace: true
          }
        )
      })
      .catch((err: WriteError) => {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError = error.getReasonWithoutStatusCode() ?? error.getErrorMessage()

        setSubmitError(formattedError)
        setSubmissionStatus(SubmissionStatus.Errored)

        onSubmitErrorCallback()
      })
  }

  return {
    submissionStatus,
    submitForm,
    submitError
  } as UseSubmitUserReturnType
}
