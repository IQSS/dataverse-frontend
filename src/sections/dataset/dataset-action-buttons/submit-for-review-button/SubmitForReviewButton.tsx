import { Dataset, DatasetStatus } from '../../../../dataset/domain/models/Dataset'
import { Button } from '@iqss/dataverse-design-system'

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

  return (
    <Button variant="secondary" disabled={dataset.isLockedFromPublishing}>
      {dataset.version.isInReview ? 'Submitted for Review' : 'Submit for Review'}
    </Button>
  )
}
