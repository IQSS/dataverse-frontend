import { Dataset, DatasetStatus } from '../../../../dataset/domain/models/Dataset'
import { Button } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface SubmitForReviewButtonProps {
  dataset: Dataset
}

export function SubmitForReviewButton({ dataset }: SubmitForReviewButtonProps) {
  if (
    !dataset.version.isLatest ||
    dataset.version.status !== DatasetStatus.DRAFT ||
    dataset.isLockedInWorkflow ||
    dataset.permissions.canPublishDataset ||
    !dataset.permissions.canUpdateDataset
  ) {
    return <></>
  }

  const { t } = useTranslation('dataset')
  return (
    <Button
      variant="secondary"
      disabled={
        dataset.isLockedFromPublishing || !dataset.hasValidTermsOfAccess || !dataset.isValid
      }>
      {dataset.version.isInReview
        ? t('datasetActionButtons.submitForReview.disabled')
        : t('datasetActionButtons.submitForReview.enabled')}
    </Button>
  )
}
