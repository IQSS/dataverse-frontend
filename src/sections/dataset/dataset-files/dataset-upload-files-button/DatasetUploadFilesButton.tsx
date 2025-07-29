import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlusLg } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import { useSession } from '../../../session/SessionContext'
import { useDataset } from '../../DatasetContext'
import { QueryParamKey, Route } from '../../../Route.enum'
import { useGetDatasetFileStore } from './useGetDatasetFileStore'
import {
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '../../../../dataset/domain/models/Dataset'
import styles from './DatasetUploadFilesButton.module.scss'

export function DatasetUploadFilesButton() {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const { dataset } = useDataset()
  const navigate = useNavigate()
  const { datasetFileStore } = useGetDatasetFileStore(dataset?.id)

  if (!user || !dataset?.permissions.canUpdateDataset) {
    return <></>
  }

  // This is a temporary solution as this use case doesn't exist in js-dataverse yet and the API should also return the file store type rather than name only.
  // When having a js-dataverse use case, this information could be fetch inside the getByPersistentId method from the DatasetJSDataverseRepository.
  if (!datasetFileStore?.startsWith('s3')) {
    return <></>
  }

  const handleClick = () => {
    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)

    if (dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    }

    navigate(`${Route.UPLOAD_DATASET_FILES}?${searchParams.toString()}`)
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      icon={<PlusLg className={styles.icon} />}
      disabled={dataset.checkIsLockedFromEdits(user.persistentId)}>
      {t('datasetActionButtons.uploadFiles')}
    </Button>
  )
}
