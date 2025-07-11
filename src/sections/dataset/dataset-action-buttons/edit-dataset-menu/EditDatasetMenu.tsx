import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Dataset,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { EditDatasetPermissionsMenu } from './EditDatasetPermissionsMenu'
import { DeleteDraftDatasetButton } from './delete-draft-dataset/DeleteDraftDatasetButton'
import { DeaccessionDatasetButton } from './DeaccessionDatasetButton'
import { useSession } from '../../../session/SessionContext'
import { QueryParamKey, Route } from '../../../Route.enum'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useNotImplementedModal } from '../../.././not-implemented/NotImplementedModalContext'

interface EditDatasetMenuProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
}

export enum EditDatasetMenuItems {
  FILES_UPLOAD = 'filesUpload',
  METADATA = 'metadata',
  TERMS = 'terms',
  PERMISSIONS = 'permissions',
  PRIVATE_URL = 'privateUrl',
  THUMBNAILS_PLUS_WIDGETS = 'thumbnailsPlusWidgets',
  DEACCESSION = 'deaccession',
  DELETE = 'delete'
}

export function EditDatasetMenu({ dataset, datasetRepository }: EditDatasetMenuProps) {
  const { user } = useSession()
  const { t } = useTranslation('dataset')
  const navigate = useNavigate()
  const { showModal } = useNotImplementedModal()

  const handleOnSelect = (eventKey: EditDatasetMenuItems | string | null) => {
    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)

    if (dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    } else {
      searchParams.set(QueryParamKey.VERSION, dataset.version.number.toString())
    }

    if (eventKey === EditDatasetMenuItems.FILES_UPLOAD) {
      navigate(`${Route.UPLOAD_DATASET_FILES}?${searchParams.toString()}`)
      return
    }
    if (eventKey === EditDatasetMenuItems.METADATA) {
      navigate(`${Route.EDIT_DATASET_METADATA}?${searchParams.toString()}`)
      return
    }
    if (eventKey === EditDatasetMenuItems.TERMS) {
      showModal()
      return
    }
    if (eventKey === EditDatasetMenuItems.PERMISSIONS) {
      showModal()
      return
    }
    if (eventKey === EditDatasetMenuItems.PRIVATE_URL) {
      showModal()
      return
    }
    if (eventKey === EditDatasetMenuItems.THUMBNAILS_PLUS_WIDGETS) {
      showModal()
      return
    }
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
      <DeleteDraftDatasetButton dataset={dataset} datasetRepository={datasetRepository} />
      <DeaccessionDatasetButton datasetRepository={datasetRepository} dataset={dataset} />
    </DropdownButton>
  )
}
