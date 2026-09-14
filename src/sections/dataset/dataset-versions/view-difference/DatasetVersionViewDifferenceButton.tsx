import { useTranslation } from 'react-i18next'
import { ArrowLeftRight } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import { useState } from 'react'
import { VersionDetailModal } from './DatasetVersionsDetailModal'
import { useGetDatasetVersionDiff } from './useGetDatasetVersionDiff'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import styles from './DatasetVersionViewDifferenceButton.module.scss'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'

interface DatasetVersionViewDifferenceButtonProps {
  persistentId: string
  selectedVersions?: DatasetVersionSummaryInfo[] | []
}

export function DatasetVersionViewDifferenceButton({
  persistentId,
  selectedVersions = []
}: DatasetVersionViewDifferenceButtonProps) {
  const { datasetRepository } = useDatasetRepositories()
  const { t } = useTranslation('dataset')

  const newVersionNumber =
    selectedVersions[0]?.id > selectedVersions[1]?.id
      ? selectedVersions[0]?.versionNumber
      : selectedVersions[1]?.versionNumber
  const oldVersionNumber =
    selectedVersions[0]?.id < selectedVersions[1]?.id
      ? selectedVersions[0]?.versionNumber
      : selectedVersions[1]?.versionNumber

  const [showModal, setShowModal] = useState(false)
  const { differences, error, isLoading } = useGetDatasetVersionDiff({
    datasetRepository,
    persistentId: persistentId,
    oldVersion: oldVersionNumber,
    newVersion: newVersionNumber
  })
  return (
    <div className={styles['edit-terms-button-container']}>
      <Button
        type="button"
        size={'sm'}
        onClick={() => setShowModal(true)}
        icon={<ArrowLeftRight className={styles.icon} />}
        disabled={isLoading}>
        {t('versions.viewDifferences')}
      </Button>

      {showModal && newVersionNumber && oldVersionNumber && (
        <VersionDetailModal
          show={!!showModal}
          handleClose={() => setShowModal(false)}
          isLoading={isLoading}
          errorHandling={error}
          datasetVersionDifferences={differences}
        />
      )}
    </div>
  )
}
