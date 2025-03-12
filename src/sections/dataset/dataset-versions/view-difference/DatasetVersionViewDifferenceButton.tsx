import { useTranslation } from 'react-i18next'
import { ArrowLeftRight } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import { useSession } from '@/sections/session/SessionContext'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { useState } from 'react'
import { VersionDetailModal } from './DatasetDetailModal'
import { useGetDatasetVersionDiff } from './useGetDatasetVersionDiff'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import styles from './DatasetVersionViewDifferenceButton.module.scss'

export function DatasetVersionViewDifferenceButton({
  oldVersionNumber,
  newVersionNumber,
  datasetRepository
}: {
  oldVersionNumber: string
  newVersionNumber: string
  datasetRepository: DatasetRepository
}) {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const { dataset } = useDataset()

  const [showModal, setShowModal] = useState(false)
  const { differences, error, isLoading } = useGetDatasetVersionDiff({
    datasetRepository,
    persistentId: dataset?.persistentId || '',
    oldVersion: oldVersionNumber,
    newVersion: newVersionNumber
  })
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
      {isLoading && <></>}
      {showModal && differences && (
        <VersionDetailModal
          show={!!showModal}
          handleClose={() => setShowModal(false)}
          isLoading={false}
          errorLoading={null}
          datasetVersionDifferences={differences}
        />
      )}
    </div>
  )
}
