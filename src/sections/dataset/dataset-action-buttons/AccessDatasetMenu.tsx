import {
  Dataset,
  DatasetPermissions,
  DatasetStatus,
  DatasetVersion
} from '../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'

interface AccessDatasetMenuProps {
  version: DatasetVersion
  permissions: DatasetPermissions
}

export function AccessDatasetMenu({ version, permissions }: AccessDatasetMenuProps) {
  if (
    !permissions.canDownloadFiles ||
    (version.status === DatasetStatus.DEACCESSIONED && !permissions.canUpdateDataset)
  ) {
    return <></>
  }

  return (
    <DropdownButton
      id={`access-dataset-menu`}
      title="Access Dataset"
      asButtonGroup
      variant="primary">
      <DropdownButtonItem>Download</DropdownButtonItem>
    </DropdownButton>
  )
}
// TODO: add download feature https://github.com/IQSS/dataverse-frontend/issues/63
// TODO: add explore feature
// TODO: add compute feature
