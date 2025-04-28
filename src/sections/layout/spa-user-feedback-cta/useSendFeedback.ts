import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { SpaUserFeedbackFormData } from './spa-user-feedback-modal/SpaUserFeedbackModal'
import { SpaFeedbackDTO } from '@/contact/domain/useCases/DTOs/SpaFeedbackDTO'

interface UseSendFeedback {
  contactRepository: ContactRepository
  onSuccessfulSend: () => void
}

export const useSendFeedback = ({ contactRepository, onSuccessfulSend }: UseSendFeedback) => {
  const { t } = useTranslation('shared')
  const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false)
  const [errorSendingFeedback, setErrorSendingFeedback] = useState<string | null>(null)

  const submitFeedback = async (data: SpaUserFeedbackFormData) => {
    setIsSendingFeedback(true)

    try {
      const spaFeedbackDTO: SpaFeedbackDTO = {
        page: data.page,
        feedback: data.feedback.trim(),
        fromEmail: data.fromEmail
      }
      console.log({ feedbackDTO: spaFeedbackDTO })

      await contactRepository.sendSpaFeedback(spaFeedbackDTO)

      onSuccessfulSend()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorSendingFeedback(formattedError)
      } else {
        setErrorSendingFeedback(t('defaultCollectionDeleteError'))
      }
    } finally {
      setIsSendingFeedback(false)
    }
  }

  return {
    isSendingFeedback,
    errorSendingFeedback,
    submitFeedback
  }
}
