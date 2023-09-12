import { Dataset, DatasetStatus } from '../../../../dataset/domain/models/Dataset'
import { DropdownButtonItem, DropdownSeparator } from '@iqss/dataverse-design-system'

interface DeleteDatasetButtonProps {
  dataset: Dataset
}
export function DeleteDatasetButton({ dataset }: DeleteDatasetButtonProps) {
  if (
    !dataset.permissions.canDeleteDataset ||
    dataset.version.latestVersionStatus !== DatasetStatus.DRAFT
  ) {
    return <></>
  }

  return (
    <>
      <DropdownSeparator />
      <DropdownButtonItem>
        {dataset.version.status === DatasetStatus.RELEASED
          ? 'Delete Draft Version'
          : 'Delete Dataset'}
      </DropdownButtonItem>
    </>
  )
}
