import { Button } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import { useSession } from '../../../session/SessionContext'
import styles from './DatasetUploadFilesButton.module.scss'
import { useTranslation } from 'react-i18next'

export function DatasetUploadFilesButton() {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const userHasDatasetUpdatePermissions = true // TODO - Implement permissions
  const datasetLockedFromEdits = false // TODO - Ask Guillermo if this a dataset property coming from the api
  const handleClick = () => {
    // TODO - Implement upload files
  }

  if (!user || !userHasDatasetUpdatePermissions) {
    return <></>
  }
  return (
    <Button
      onClick={handleClick}
      icon={<PlusLg className={styles.icon} />}
      disabled={datasetLockedFromEdits}>
      {t('actions.uploadFiles')}
    </Button>
  )
}
