import { Dataset } from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useSettings } from '../../../settings/SettingsContext'
import { useEffect, useState } from 'react'
import { SettingName } from '../../../../settings/domain/models/Setting'
import { HasPublicStore } from '../../../../settings/domain/models/HasPublicStore'

interface EditDatasetPermissionsMenuProps {
  dataset: Dataset
}
export function EditDatasetPermissionsMenu({ dataset }: EditDatasetPermissionsMenuProps) {
  if (
    !dataset.permissions.canManageDatasetPermissions &&
    !dataset.permissions.canManageFilesPermissions
  ) {
    return <></>
  }

  const { getSettingByName } = useSettings()
  const [hasPublicStore, setHasPublicStore] = useState<HasPublicStore>(false)

  useEffect(() => {
    getSettingByName<HasPublicStore>(SettingName.HAS_PUBLIC_STORE)
      .then((hasPublicStoreSetting) => {
        setHasPublicStore(hasPublicStoreSetting.value)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [getSettingByName])

  if (hasPublicStore) {
    return <DropdownButtonItem>Permissions</DropdownButtonItem>
  }

  return (
    <DropdownButton id={`edit-permissions-menu`} title="Permissions" variant="secondary">
      {dataset.permissions.canManageDatasetPermissions && (
        <DropdownButtonItem>Dataset</DropdownButtonItem>
      )}
      {dataset.permissions.canManageFilesPermissions && (
        <DropdownButtonItem>File</DropdownButtonItem>
      )}
    </DropdownButton>
  )
}
