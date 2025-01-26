import { useTranslation } from 'react-i18next'
import { Backpack } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import styles from './EditDatasetTermsButton.module.scss'
import { useSession } from '@/sections/session/SessionContext'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { useNotImplementedModal } from '@/sections/not-implemented/NotImplementedModalContext'

export function EditDatasetTermsButton() {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const { dataset } = useDataset()
  const { showModal } = useNotImplementedModal()

  if (!user || !dataset?.permissions.canUpdateDataset) {
    return <></>
  }

  const handleClick = () => {
    showModal()
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      icon={<Backpack className={styles.icon} />}
      disabled={dataset.checkIsLockedFromEdits(user.persistentId)}>
      {t('terms.editTermsButton')}
    </Button>
  )
}
