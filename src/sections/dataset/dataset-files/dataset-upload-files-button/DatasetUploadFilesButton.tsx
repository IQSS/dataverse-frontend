import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlusLg } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import { useSession } from '../../../session/SessionContext'
import { useDataset } from '../../DatasetContext'
import { QueryParamKey, Route } from '../../../Route.enum'
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
    navigate(`${Route.UPLOAD_DATASET_FILES}?${QueryParamKey.PERSISTENT_ID}=${dataset.persistentId}`)
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
