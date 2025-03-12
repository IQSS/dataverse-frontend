import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import { useSession } from '@/sections/session/SessionContext'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { useState } from 'react'
import { VersionDetailModal } from './view-difference/DatasetDetailModal'
import { useGetDatasetVersionDiff } from './view-difference/useGetDatasetVersionDiff'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface DatasetViewDetailButtonProps {
  oldVersionNumber: string
  newVersionNumber: string
  datasetRepository: DatasetRepository
}
export function DatasetViewDetailButton({
  oldVersionNumber,
  newVersionNumber,
  datasetRepository
}: DatasetViewDetailButtonProps) {
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
    <div>
      <Button
        variant="link"
        size={'sm'}
        onClick={handleClick}
        disabled={dataset.checkIsLockedFromEdits(user.persistentId)}>
        {t('View Detail')}
      </Button>
      {showModal && differences && (
        <VersionDetailModal
          show={!!showModal}
          handleClose={() => {
            setShowModal(false)
          }}
          isLoading={false}
          errorLoading={null}
          datasetVersionDifferences={differences}
        />
      )}
    </div>
  )
}
