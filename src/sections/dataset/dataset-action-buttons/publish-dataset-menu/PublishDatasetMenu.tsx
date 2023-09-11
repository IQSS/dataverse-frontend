import { Dataset, DatasetStatus } from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { ChangeCurationStatusMenu } from './ChangeCurationStatusMenu'

interface PublishDatasetMenuProps {
  dataset: Dataset
}

export function PublishDatasetMenu({ dataset }: PublishDatasetMenuProps) {
  if (
    !dataset.version.isLatest ||
    dataset.version.status !== DatasetStatus.DRAFT ||
    !dataset.permissions.canPublishDataset
  ) {
    return <></>
  }

  return (
    <DropdownButton
      id={`publish-dataset-menu`}
      title="Publish Dataset"
      asButtonGroup
      variant="secondary"
      disabled={dataset.isLockedFromPublishing}>
      <DropdownButtonItem>Publish</DropdownButtonItem>
      <ChangeCurationStatusMenu />
    </DropdownButton>
  )
}
