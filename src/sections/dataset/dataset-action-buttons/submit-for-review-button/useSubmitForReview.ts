import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { submitDatasetForReview } from '@/dataset/domain/useCases/submitDatasetForReview'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface UseSubmitForReviewProps {
  datasetRepository: DatasetRepository
  onSuccessfulSubmit: () => void
}

interface UseSubmitForReviewReturn {
  isSubmitting: boolean
  errorSubmitting: string | null
  resetError: () => void
  handleSubmitForReview: (datasetId: string | number) => Promise<void>
}

export const useSubmitForReview = ({
  datasetRepository,
  onSuccessfulSubmit
}: UseSubmitForReviewProps): UseSubmitForReviewReturn => {
  const { t } = useTranslation('dataset')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorSubmitting, setErrorSubmitting] = useState<string | null>(null)

  const handleSubmitForReview = async (datasetId: string | number) => {
    setIsSubmitting(true)
    setErrorSubmitting(null)

    try {
      await submitDatasetForReview(datasetRepository, datasetId)
      onSuccessfulSubmit()
    } catch (err: WriteError | unknown) {
      const reason =
        err instanceof WriteError
          ? new JSDataverseWriteErrorHandler(err).getReasonWithoutStatusCode()
          : null
      setErrorSubmitting(reason ?? t('datasetActionButtons.submitForReview.defaultError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    errorSubmitting,
    resetError: () => setErrorSubmitting(null),
    handleSubmitForReview
  }
}
