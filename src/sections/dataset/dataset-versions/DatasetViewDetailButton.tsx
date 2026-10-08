import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import { useState } from 'react'
import { VersionDetailModal } from './view-difference/DatasetVersionsDetailModal'
import { useGetDatasetVersionDiff } from './view-difference/useGetDatasetVersionDiff'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'

interface DatasetViewDetailButtonProps {
  oldVersionNumber: string
  newVersionNumber: string
  datasetId: string
}
export function DatasetViewDetailButton({
  oldVersionNumber,
  newVersionNumber,
  datasetId
}: DatasetViewDetailButtonProps) {
  const { datasetRepository } = useDatasetRepositories()
  const { t } = useTranslation('dataset')
  const [showModal, setShowModal] = useState(false)
  const { differences, error, isLoading } = useGetDatasetVersionDiff({
    datasetRepository,
    persistentId: datasetId,
    oldVersion: oldVersionNumber,
    newVersion: newVersionNumber
  })

  if (!differences) {
    return (
      <span>
        {t('datasetVersionSummary.noVersionDifferences', {
          oldVersion: oldVersionNumber,
          newVersion: newVersionNumber
        })}
      </span>
    )
  }

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
