import { Dataset, DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { Button } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../../session/SessionContext'

interface SubmitForReviewButtonProps {
  dataset: Dataset
}

export function SubmitForReviewButton({ dataset }: SubmitForReviewButtonProps) {
  const { user } = useSession()
  const { t } = useTranslation('dataset')

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

  return (
    <Button
      variant="secondary"
      disabled={
        dataset.checkIsLockedFromPublishing(user.persistentId) ||
        !dataset.hasValidTermsOfAccess ||
        !dataset.isValid
      }>
      {dataset.version.isInReview
        ? t('datasetActionButtons.submitForReview.disabled')
        : t('datasetActionButtons.submitForReview.enabled')}
    </Button>
  )
}
