import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Dataset,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { EditDatasetPermissionsMenu } from './EditDatasetPermissionsMenu'
import { DeleteDatasetButton } from './DeleteDatasetButton'
import { DeaccessionDatasetButton } from './DeaccessionDatasetButton'
import { useNotImplementedModal } from '../../../not-implemented/NotImplementedModalContext'
import { useSession } from '../../../session/SessionContext'
import { QueryParamKey, Route } from '../../../Route.enum'

interface EditDatasetMenuProps {
  dataset: Dataset
}

enum EditDatasetMenuItems {
  FILES_UPLOAD = 'filesUpload',
  METADATA = 'metadata',
  TERMS = 'terms',
  PERMISSIONS = 'permissions',
  PRIVATE_URL = 'privateUrl',
  THUMBNAILS_PLUS_WIDGETS = 'thumbnailsPlusWidgets'
}

export function EditDatasetMenu({ dataset }: EditDatasetMenuProps) {
  const { user } = useSession()
  const { showModal } = useNotImplementedModal()
  const { t } = useTranslation('dataset')
  const navigate = useNavigate()

  console.log(dataset.version)

  const handleOnSelect = (eventKey: EditDatasetMenuItems | string | null) => {
    if (eventKey === EditDatasetMenuItems.FILES_UPLOAD) {
      navigate(
        `${Route.UPLOAD_DATASET_FILES}?${QueryParamKey.PERSISTENT_ID}=${dataset.persistentId}`
      )
      return
    }
    if (eventKey === EditDatasetMenuItems.METADATA) {
      const searchParams = new URLSearchParams()
      searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)

      if (dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
      }

      navigate(`${Route.EDIT_DATASET_METADATA}?${searchParams.toString()}`)

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
        eventKey={EditDatasetMenuItems.FILES_UPLOAD}
        as="button"
        disabled={!dataset.hasValidTermsOfAccess}>
        {t('datasetActionButtons.editDataset.filesUpload')}
      </DropdownButtonItem>
      <DropdownButtonItem
        eventKey={EditDatasetMenuItems.METADATA}
        as="button"
        disabled={!dataset.hasValidTermsOfAccess}>
        {t('datasetActionButtons.editDataset.metadata')}
      </DropdownButtonItem>
      <DropdownButtonItem eventKey={EditDatasetMenuItems.TERMS} as="button">
        {t('datasetActionButtons.editDataset.terms')}
      </DropdownButtonItem>
      <EditDatasetPermissionsMenu dataset={dataset} />
      {(dataset.permissions.canManageDatasetPermissions ||
        dataset.permissions.canManageFilesPermissions) && (
        <DropdownButtonItem eventKey={EditDatasetMenuItems.PRIVATE_URL} as="button">
          {t('datasetActionButtons.editDataset.privateUrl')}
        </DropdownButtonItem>
      )}
      <DropdownButtonItem eventKey={EditDatasetMenuItems.THUMBNAILS_PLUS_WIDGETS} as="button">
        {t('datasetActionButtons.editDataset.thumbnailsPlusWidgets')}
      </DropdownButtonItem>
      <DeleteDatasetButton dataset={dataset} />
      <DeaccessionDatasetButton dataset={dataset} />
    </DropdownButton>
  )
}
