import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import { useState } from 'react'
import { VersionDetailModal } from './view-difference/DatasetVersionsDetailModal'
import { useGetDatasetVersionDiff } from './view-difference/useGetDatasetVersionDiff'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface DatasetViewDetailButtonProps {
  oldVersionNumber: string
  newVersionNumber: string
  datasetRepository: DatasetRepository
  datasetId: string
}
export function DatasetViewDetailButton({
  oldVersionNumber,
  newVersionNumber,
  datasetRepository,
  datasetId
}: DatasetViewDetailButtonProps) {
  const { t } = useTranslation('dataset')
  const [showModal, setShowModal] = useState(false)
  const { differences, error, isLoading } = useGetDatasetVersionDiff({
    datasetRepository,
    persistentId: datasetId,
    oldVersion: oldVersionNumber,
    newVersion: newVersionNumber
  })

  return (
    <>
      <Button variant="link" onClick={() => setShowModal(true)} style={{ padding: 0 }}>
        {t('versions.viewDetails')}
      </Button>
      {showModal && differences && (
        <VersionDetailModal
          show={!!showModal}
          handleClose={() => {
            setShowModal(false)
          }}
          isLoading={isLoading}
          errorHandling={error}
          datasetVersionDifferences={differences}
        />
      )}
    </>
  )
}
