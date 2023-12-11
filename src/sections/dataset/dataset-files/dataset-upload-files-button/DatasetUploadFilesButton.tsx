import { Button } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import { useSession } from '../../../session/SessionContext'
import styles from './DatasetUploadFilesButton.module.scss'
import { useTranslation } from 'react-i18next'
import { useDataset } from '../../DatasetContext'
import { useNotImplementedModal } from '../../../not-implemented/NotImplementedModalContext'

export function DatasetUploadFilesButton() {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const { dataset } = useDataset()
  const handleClick = () => {
    // TODO - Implement upload files
    showModal()
  }
  const { showModal } = useNotImplementedModal()
  if (!user || !dataset?.permissions.canUpdateDataset) {
    return <></>
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
