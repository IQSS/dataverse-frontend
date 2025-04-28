import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { SpaUserFeedbackFormData } from './spa-user-feedback-modal/SpaUserFeedbackModal'

interface UseSendFeedback {
  //   collectionRepository: CollectionRepository
  onSuccessfulSend: () => void
}

export const useSendFeedback = ({ onSuccessfulSend }: UseSendFeedback) => {
  const { t } = useTranslation('shared')
  const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false)
  const [errorSendingFeedback, setErrorSendingFeedback] = useState<string | null>(null)

  const submitFeedback = (data: SpaUserFeedbackFormData) => {
    setIsSendingFeedback(true)

    try {
      // TODO: Once we have an API for sending user feedback, we can replace this with the actual API call
      const feedbackDTO = {
        page: data.page,
        feedback: data.feedback.trim()
      }
      console.log({ payload: feedbackDTO })

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
