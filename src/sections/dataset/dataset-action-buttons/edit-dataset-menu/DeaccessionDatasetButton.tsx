import { Dataset, DatasetStatus } from '../../../../dataset/domain/models/Dataset'
import { DropdownButtonItem, DropdownSeparator } from '@iqss/dataverse-design-system'

interface DeaccessionDatasetButtonProps {
  dataset: Dataset
}
export function DeaccessionDatasetButton({ dataset }: DeaccessionDatasetButtonProps) {
  if (dataset.version.status !== DatasetStatus.RELEASED || !dataset.permissions.canPublishDataset) {
    return <></>
  }

  return (
    <>
      <DropdownSeparator />
      <DropdownButtonItem>Deaccession Dataset</DropdownButtonItem>
    </>
  )
}
