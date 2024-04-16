import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Dataset } from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { EditDatasetPermissionsMenu } from './EditDatasetPermissionsMenu'
import { DeleteDatasetButton } from './DeleteDatasetButton'
import { DeaccessionDatasetButton } from './DeaccessionDatasetButton'
import { useNotImplementedModal } from '../../../not-implemented/NotImplementedModalContext'
import { useSession } from '../../../session/SessionContext'
import { Route } from '../../../Route.enum'

interface EditDatasetMenuProps {
  dataset: Dataset
}

const editDatasetMenuItemOptions = {
  FILES_UPLOAD: 'filesUpload',
  METADATA: 'metadata',
  TERMS: 'terms',
  PERMISSIONS: 'permissions',
  PRIVATE_URL: 'privateUrl',
  THUMBNAILS_PLUS_WIDGETS: 'thumbnailsPlusWidgets'
} as const

type EditDatasetMenuItems =
  (typeof editDatasetMenuItemOptions)[keyof typeof editDatasetMenuItemOptions]

export function EditDatasetMenu({ dataset }: EditDatasetMenuProps) {
  const { user } = useSession()
  const { showModal } = useNotImplementedModal()
  const { t } = useTranslation('dataset')
  const navigate = useNavigate()

  const handleOnSelect = (eventKey: EditDatasetMenuItems | null) => {
    if (eventKey === 'filesUpload') {
      navigate(`${Route.EDIT_DATASET_FILES}?persistendId=${dataset.persistentId}`)
      return
    }
    showModal()
  }

  if (!user || !dataset.permissions.canUpdateDataset) {
    return <></>
  }

  return (
    <DropdownButton
      onSelect={handleOnSelect}
      id={`edit-dataset-menu`}
      title={t('datasetActionButtons.editDataset.title')}
      asButtonGroup
      variant="secondary"
      disabled={dataset.checkIsLockedFromEdits(user.persistentId)}>
      <DropdownButtonItem
        eventKey={editDatasetMenuItemOptions.FILES_UPLOAD}
        disabled={!dataset.hasValidTermsOfAccess}>
        {t('datasetActionButtons.editDataset.filesUpload')}
      </DropdownButtonItem>
      <DropdownButtonItem
        eventKey={editDatasetMenuItemOptions.METADATA}
        disabled={!dataset.hasValidTermsOfAccess}>
        {t('datasetActionButtons.editDataset.metadata')}
      </DropdownButtonItem>
      <DropdownButtonItem eventKey={editDatasetMenuItemOptions.TERMS}>
        {t('datasetActionButtons.editDataset.terms')}
      </DropdownButtonItem>
      <EditDatasetPermissionsMenu dataset={dataset} />
      {(dataset.permissions.canManageDatasetPermissions ||
        dataset.permissions.canManageFilesPermissions) && (
        <DropdownButtonItem eventKey={editDatasetMenuItemOptions.PRIVATE_URL}>
          {t('datasetActionButtons.editDataset.privateUrl')}
        </DropdownButtonItem>
      )}
      <DropdownButtonItem eventKey={editDatasetMenuItemOptions.THUMBNAILS_PLUS_WIDGETS}>
        {t('datasetActionButtons.editDataset.thumbnailsPlusWidgets')}
      </DropdownButtonItem>
      <DeleteDatasetButton dataset={dataset} />
      <DeaccessionDatasetButton dataset={dataset} />
    </DropdownButton>
  )
}
