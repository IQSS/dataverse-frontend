import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlusLg } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import { useSession } from '../../../session/SessionContext'
import { useDataset } from '../../DatasetContext'
import { QueryParamKey, Route } from '../../../Route.enum'
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

  if (!user || !dataset?.permissions.canUpdateDataset) {
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
