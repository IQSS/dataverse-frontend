import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { FeedbackDTO } from '@/contact/domain/useCases/DTOs/FeedbackDTO'
import { ContactResponse } from '@/contact/domain/models/ContactResponse'
import { useState } from 'react'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { useTranslation } from 'react-i18next'

export type UseSubmitContactReturnType = {
  submitForm: (formData: FeedbackDTO) => Promise<ContactResponse[] | string>
  submitError: string | null
}

interface UseSendFeedbacktoOwnersProps {
  contactRepository: ContactRepository
  onSuccessfulSubmit: () => void
}

export function useSendFeedbacktoOwners({
  contactRepository,
  onSuccessfulSubmit
}: UseSendFeedbacktoOwnersProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { t } = useTranslation('shared')

  const submitForm = async (formData: FeedbackDTO): Promise<ContactResponse[] | string> => {
    setIsSubmittingForm(true)
    setSubmitError(null)
    try {
      const contactResponse: ContactResponse[] = await contactRepository.sendFeedbacktoOwners(
        formData
      )
      onSuccessfulSubmit()
      return contactResponse
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError = error.getReasonWithoutStatusCode() ?? error.getErrorMessage()
        setSubmitError(formattedError)
      } else {
        setSubmitError(t('contact.defaultFeedbackSubmitError'))
      }
      return submitError ?? t('contact.defaultFeedbackSubmitError')
    } finally {
      setIsSubmittingForm(false)
    }
  }

  return {
    isSubmittingForm,
    submitForm,
    submitError
  }
}
