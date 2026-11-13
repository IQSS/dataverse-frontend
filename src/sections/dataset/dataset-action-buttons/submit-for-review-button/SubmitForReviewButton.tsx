import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@iqss/dataverse-design-system'
import { Dataset, DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { useSession } from '../../../session/SessionContext'
import { useDataset } from '../../DatasetContext'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { useSubmitForReview } from './useSubmitForReview'
import { SubmitForReviewModal } from './SubmitForReviewModal'

interface SubmitForReviewButtonProps {
  dataset: Dataset
}

export function SubmitForReviewButton({ dataset }: SubmitForReviewButtonProps) {
  const { user } = useSession()
  const { t } = useTranslation('dataset')
  const { datasetRepository } = useDatasetRepositories()
  const { refreshDataset } = useDataset()
  const [showModal, setShowModal] = useState(false)

  const { isSubmitting, errorSubmitting, resetError, handleSubmitForReview } = useSubmitForReview({
    datasetRepository,
    onSuccessfulSubmit: () => {
      setShowModal(false)
      toast.success(t('datasetActionButtons.submitForReview.success'))
      refreshDataset()
    }
  })

  if (
    !dataset.version.isLatest ||
    dataset.version.publishingStatus !== DatasetPublishingStatus.DRAFT ||
    dataset.isLockedInWorkflow ||
    dataset.permissions.canPublishDataset ||
    !user ||
    !dataset.permissions.canUpdateDataset
  ) {
    return <></>
  }

  const handleOpenModal = () => {
    resetError()
    setShowModal(true)
  }

  return (
    <>
      <Button
        variant="secondary"
        disabled={
          dataset.version.isInReview ||
          dataset.checkIsLockedFromPublishing(user.persistentId) ||
          !dataset.hasValidTermsOfAccess ||
          !dataset.isValid
        }
        onClick={handleOpenModal}>
        {dataset.version.isInReview
          ? t('datasetActionButtons.submitForReview.disabled')
          : t('datasetActionButtons.submitForReview.enabled')}
      </Button>
      <SubmitForReviewModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSubmit={() => void handleSubmitForReview(dataset.persistentId)}
        isSubmitting={isSubmitting}
        errorSubmitting={errorSubmitting}
      />
    </>
  )
}
