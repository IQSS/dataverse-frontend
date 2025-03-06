import { useState } from 'react'
import { Dataset } from '../../../../dataset/domain/models/Dataset'
import { DropdownButtonItem, DropdownSeparator } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DeaccessionDatasetModal } from '@/sections/dataset/deaccession-dataset/DeaccessionDatasetModal'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface DeaccessionDatasetButtonProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
}

export function DeaccessionDatasetButton({
  dataset,
  datasetRepository
}: DeaccessionDatasetButtonProps) {
  const { t } = useTranslation('dataset')
  const [showDeaccessionModal, setShowDeaccessionModal] = useState(false)

  if (
    !dataset.version.someDatasetVersionHasBeenReleased ||
    !dataset.permissions.canPublishDataset
  ) {
    return <></>
  }

  const handleOpen = () => setShowDeaccessionModal(true)
  const handleClose = () => setShowDeaccessionModal(false)

  return (
    <>
      <DropdownSeparator />
      <DropdownButtonItem onClick={handleOpen}>
        {t('datasetActionButtons.editDataset.deaccession')}
      </DropdownButtonItem>
      <DeaccessionDatasetModal
        show={showDeaccessionModal}
        repository={datasetRepository}
        persistentId={dataset.persistentId}
        versionList={dataset.versionsSummaries}
        handleClose={handleClose}
      />
    </>
  )
}
