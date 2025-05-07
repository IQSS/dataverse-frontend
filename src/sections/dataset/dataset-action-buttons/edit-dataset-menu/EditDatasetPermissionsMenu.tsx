import { Dataset } from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useSettings } from '../../../settings/SettingsContext'
import { SettingName } from '../../../../settings/domain/models/Setting'
import { HasPublicStore } from '../../../../settings/domain/models/HasPublicStore'
import { useTranslation } from 'react-i18next'
import { useNotImplementedModal } from '../../.././not-implemented/NotImplementedModalContext'

interface EditDatasetPermissionsMenuProps {
  dataset: Dataset
}
export function EditDatasetPermissionsMenu({ dataset }: EditDatasetPermissionsMenuProps) {
  const { t } = useTranslation('dataset')
  const { getSettingByName } = useSettings()
  const hasPublicStore =
    getSettingByName<HasPublicStore>(SettingName.HAS_PUBLIC_STORE)?.value || false
  const { showModal } = useNotImplementedModal()

  if (
    !dataset.permissions.canManageDatasetPermissions &&
    !dataset.permissions.canManageFilesPermissions
  ) {
    return <></>
  }

  if (hasPublicStore) {
    return (
      <DropdownButtonItem>
        {t('datasetActionButtons.editDataset.permissions.title')}
      </DropdownButtonItem>
    )
  }

  return (
    <DropdownButton
      id={`edit-permissions-menu`}
      title={t('datasetActionButtons.editDataset.permissions.title')}
      variant="secondary"
      onSelect={showModal}>
      {dataset.permissions.canManageDatasetPermissions && (
        <DropdownButtonItem>
          {t('datasetActionButtons.editDataset.permissions.dataset')}
        </DropdownButtonItem>
      )}
      {dataset.permissions.canManageFilesPermissions && (
        <DropdownButtonItem>
          {t('datasetActionButtons.editDataset.permissions.file')}
        </DropdownButtonItem>
      )}
    </DropdownButton>
  )
}
