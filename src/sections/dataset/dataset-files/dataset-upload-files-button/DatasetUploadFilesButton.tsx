import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlusLg } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import { useSession } from '../../../session/SessionContext'
import { useDataset } from '../../DatasetContext'
import { Route } from '../../../Route.enum'
import styles from './DatasetUploadFilesButton.module.scss'

export function DatasetUploadFilesButton() {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const { dataset } = useDataset()

  if (!user || !dataset?.permissions.canUpdateDataset) {
    return <></>
  }

  return (
    <Button
      type="button"
      icon={<PlusLg className={styles.icon} />}
      disabled={dataset.checkIsLockedFromEdits(user.persistentId)}
      as={Link}
      to={`${Route.EDIT_DATASET_FILES}?persistendId=${dataset.persistentId}`}>
      {t('datasetActionButtons.uploadFiles')}
    </Button>
  )
}
