import { Dataset } from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { EditDatasetPermissionsMenu } from './EditDatasetPermissionsMenu'
import { DeleteDatasetButton } from './DeleteDatasetButton'
import { DeaccessionDatasetButton } from './DeaccessionDatasetButton'

interface EditDatasetMenuProps {
  dataset: Dataset
}

export function EditDatasetMenu({ dataset }: EditDatasetMenuProps) {
  if (!dataset.permissions.canUpdateDataset) {
    return <></>
  }

  return (
    <DropdownButton
      id={`edit-dataset-menu`}
      title="Edit Dataset"
      asButtonGroup
      variant="secondary"
      disabled={dataset.isLockedFromEdits}>
      <DropdownButtonItem disabled={!dataset.hasValidTermsOfAccess}>
        Files (Upload)
      </DropdownButtonItem>
      <DropdownButtonItem disabled={!dataset.hasValidTermsOfAccess}>Metadata</DropdownButtonItem>
      <DropdownButtonItem>Terms</DropdownButtonItem>
      <EditDatasetPermissionsMenu dataset={dataset} />
      {(dataset.permissions.canManageDatasetPermissions ||
        dataset.permissions.canManageFilesPermissions) && (
        <DropdownButtonItem>Private URL</DropdownButtonItem>
      )}
      <DropdownButtonItem>Thumbnails + Widgets</DropdownButtonItem>
      <DeleteDatasetButton dataset={dataset} />
      <DeaccessionDatasetButton dataset={dataset} />
    </DropdownButton>
  )
}
