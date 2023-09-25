import { Button } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import { useSession } from '../../../session/SessionContext'
import styles from './DatasetUploadFilesButton.module.scss'
import { useTranslation } from 'react-i18next'
import { useDataset } from '../../DatasetContext'

export function DatasetUploadFilesButton() {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const { dataset } = useDataset()
  const handleClick = () => {
    // TODO - Implement upload files
  }

  if (!user || !dataset?.permissions.canUpdateDataset) {
    return <></>
  }

  return (
    <Button
      onClick={handleClick}
      icon={<PlusLg className={styles.icon} />}
      disabled={dataset.isLockedFromEdits}>
      {t('datasetActionButtons.uploadFiles')}
    </Button>
  )
}
