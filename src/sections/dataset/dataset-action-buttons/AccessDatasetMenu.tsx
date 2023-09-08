import { Dataset, DatasetStatus } from '../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'

interface AccessDatasetMenuProps {
  dataset: Dataset
}

export function AccessDatasetMenu({ dataset }: AccessDatasetMenuProps) {
  if (
    !dataset.permissions.canDownloadFiles ||
    (dataset.version.status === DatasetStatus.DEACCESSIONED &&
      !dataset.permissions.canUpdateDataset)
  ) {
    return <></>
  }

  return (
    <DropdownButton
      id={`dataset-access-menu`}
      title="Access Dataset"
      asButtonGroup
      variant="primary">
      <DropdownButtonItem>Download</DropdownButtonItem>
    </DropdownButton>
  )
}
