import { useTranslation } from 'react-i18next'
import { ArrowLeftRight } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import styles from '../dataset-terms/EditDatasetTermsButton.module.scss'
import { useSession } from '@/sections/session/SessionContext'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { DatasetVersionViewDifferenceModal } from './DatasetVersionViewDifferenceModal'
import { useState } from 'react'

export function DatasetVersionViewDifferenceButton() {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const { dataset } = useDataset()
  const [showModal, setShowModal] = useState(false)

  if (!user || !dataset?.permissions.canUpdateDataset) {
    return null
  }

  const handleClick = () => {
    setShowModal(true)
  }

  return (
    <div className={styles['edit-terms-button-container']}>
      <Button
        type="button"
        size={'sm'}
        onClick={handleClick}
        icon={<ArrowLeftRight className={styles.icon} />}
        disabled={dataset.checkIsLockedFromEdits(user.persistentId)}>
        {t('View Difference')}
      </Button>
      {showModal && (
        <DatasetVersionViewDifferenceModal
          show={!!showModal}
          handleClose={() => setShowModal(false)}
          isLoading={false}
          dataset={null}
          errorLoading={null}
        />
      )}
    </div>
  )
}
