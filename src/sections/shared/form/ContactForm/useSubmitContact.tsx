import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { ContactDTO } from '@/contact/domain/useCases/ContactDTO'
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
  submitForm: (formData: ContactDTO) => Promise<Contact[]>
  submitError: string | null
}

export type ContactFormData = {
  targetId?: number
  identifier?: string
  subject: string
  body: string
  fromEmail: string
}

export function useSubmitContact(contactRepository: ContactRepository): UseSubmitContactReturnType {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = async (formData: ContactDTO): Promise<Contact[]> => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)
    setSubmitError(null)
    try {
      const contacts: Contact[] = await contactRepository.submitContactInfo(formData)
      console.log('Contact submitted successfully:', contacts)
      setSubmissionStatus(SubmissionStatus.SubmitComplete)
      return contacts
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unknown error occurred')
      setSubmissionStatus(SubmissionStatus.Errored)
      return []
    }
  }

  return {
    submissionStatus,
    submitForm,
    submitError
  }
}
