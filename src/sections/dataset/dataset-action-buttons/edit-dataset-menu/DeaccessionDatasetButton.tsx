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

  const handleOpenDeaccessionModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeaccessionModal(true)
  }

  const handleCloseDeaccessionModal = () => setShowDeaccessionModal(false)

  return (
    <>
      <DropdownSeparator />
      <DropdownButtonItem onClick={handleOpenDeaccessionModal}>
        {t('datasetActionButtons.editDataset.deaccession')}
      </DropdownButtonItem>
      <DeaccessionDatasetModal
        datasetRepository={datasetRepository}
        datasetPersistentId={dataset.persistentId}
        show={showDeaccessionModal}
        handleCloseDeaccessionModal={handleCloseDeaccessionModal}
        key={dataset.internalVersionNumber}
      />
    </>
  )
}
