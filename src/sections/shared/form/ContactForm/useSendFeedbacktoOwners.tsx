import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { FeedbackDTO } from '@/contact/domain/useCases/FeedbackDTO'
import { Contact } from '@/contact/domain/models/Contact'
import { useState } from 'react'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

export type UseSubmitContactReturnType = {
  submissionStatus: SubmissionStatus
  submitForm: (formData: FeedbackDTO) => Promise<Contact[] | string>
  submitError: string | null
}

export function useSendFeedbacktoOwners(
  contactRepository: ContactRepository
): UseSubmitContactReturnType {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = async (formData: FeedbackDTO): Promise<Contact[] | string> => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)
    setSubmitError(null)
    try {
      const contacts: Contact[] = await contactRepository.sendFeedbacktoOwners(formData)
      setSubmissionStatus(SubmissionStatus.SubmitComplete)
      return contacts
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unknown error occurred')
      setSubmissionStatus(SubmissionStatus.Errored)
      return error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }

  return {
    submissionStatus,
    submitForm,
    submitError
  }
}
