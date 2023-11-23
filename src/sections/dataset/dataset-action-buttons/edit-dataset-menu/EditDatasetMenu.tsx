import { Dataset } from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { EditDatasetPermissionsMenu } from './EditDatasetPermissionsMenu'
import { DeleteDatasetButton } from './DeleteDatasetButton'
import { DeaccessionDatasetButton } from './DeaccessionDatasetButton'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../../session/SessionContext'

interface EditDatasetMenuProps {
  dataset: Dataset
}

export function EditDatasetMenu({ dataset }: EditDatasetMenuProps) {
  const { user } = useSession()

  if (!user || !dataset.permissions.canUpdateDataset) {
    return <></>
  }

  const { t } = useTranslation('dataset')
  return (
    <DropdownButton
      id={`edit-dataset-menu`}
      title={t('datasetActionButtons.editDataset.title')}
      asButtonGroup
      variant="secondary"
      disabled={dataset.checkIsLockedFromEdits(user.persistentId)}>
      <DropdownButtonItem disabled={!dataset.hasValidTermsOfAccess}>
        {t('datasetActionButtons.editDataset.filesUpload')}
      </DropdownButtonItem>
      <DropdownButtonItem disabled={!dataset.hasValidTermsOfAccess}>
        {t('datasetActionButtons.editDataset.metadata')}
      </DropdownButtonItem>
      <DropdownButtonItem>{t('datasetActionButtons.editDataset.terms')}</DropdownButtonItem>
      <EditDatasetPermissionsMenu dataset={dataset} />
      {(dataset.permissions.canManageDatasetPermissions ||
        dataset.permissions.canManageFilesPermissions) && (
        <DropdownButtonItem>{t('datasetActionButtons.editDataset.privateUrl')}</DropdownButtonItem>
      )}
      <DropdownButtonItem>
        {t('datasetActionButtons.editDataset.thumbnailsPlusWidgets')}
      </DropdownButtonItem>
      <DeleteDatasetButton dataset={dataset} />
      <DeaccessionDatasetButton dataset={dataset} />
    </DropdownButton>
  )
}
