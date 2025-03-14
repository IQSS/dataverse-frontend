import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { useState } from 'react'
import { VersionDetailModal } from './view-difference/DatasetVersionsDetailModal'
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
  const { dataset } = useDataset()

  const [showModal, setShowModal] = useState(false)
  const { differences, error, isLoading } = useGetDatasetVersionDiff({
    datasetRepository,
    persistentId: dataset?.persistentId || '',
    oldVersion: oldVersionNumber,
    newVersion: newVersionNumber
  })

  const handleClick = () => {
    setShowModal(true)
  }

  return (
    <>
      <Button variant="link" onClick={handleClick} style={{ padding: 0 }}>
        {t('View Detail')}
      </Button>
      {showModal && differences && (
        <VersionDetailModal
          show={!!showModal}
          handleClose={() => {
            setShowModal(false)
          }}
          isLoading={isLoading}
          errorLoading={error}
          datasetVersionDifferences={differences}
        />
      )}
    </>
  )
}
