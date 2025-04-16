import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { RouteWithParams } from '@/sections/Route.enum'
import { Dataset, DatasetPublishingStatus } from '../../../../../dataset/domain/models/Dataset'
import { useDeleteDataset } from './useDeleteDataset'
import { DropdownButtonItem, DropdownSeparator } from '@iqss/dataverse-design-system'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersion } from '@/dataset/domain/models/Dataset'
import { ConfirmDeleteDatasetModal } from './ConfirmDeleteDatasetModal'

interface DeleteDatasetButtonProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
}
export function DeleteDatasetButton({ dataset, datasetRepository }: DeleteDatasetButtonProps) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('dataset')

  const handleOpenModal = () => setShowConfirmationModal(true)
  const handleCloseModal = () => setShowConfirmationModal(false)

  const { handleDeleteDataset, isDeletingDataset, errorDeletingDataset } = useDeleteDataset({
    datasetRepository,
    onSuccessfulDelete: closeModalAndNavigateToDataset
  })
  console.log('dataset', dataset)
  function closeModalAndNavigateToDataset() {
    handleCloseModal()

    if (!dataset.version.someDatasetVersionHasBeenReleased) {
      navigate(RouteWithParams.COLLECTIONS(dataset.hierarchy.id))
      console.log('dataset.hierarchy.id', dataset.hierarchy.id)
    } else {
      const searchParams = new URLSearchParams()
      searchParams.set('persistentId', dataset.persistentId)
      searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersion.LATEST_PUBLISHED)
      navigate(`${Route.DATASETS}?${searchParams.toString()}`)
    }

    toast.success(t('alerts.datasetDeletedSuccess'))
  }

  if (
    !dataset.permissions.canDeleteDataset ||
    dataset.version.latestVersionPublishingStatus !== DatasetPublishingStatus.DRAFT
  ) {
    return <></>
  }

  return (
    <>
      <DropdownSeparator />
      <DropdownButtonItem onClick={handleOpenModal}>
        {dataset.version.someDatasetVersionHasBeenReleased
          ? t('datasetActionButtons.editDataset.delete.released')
          : t('datasetActionButtons.editDataset.delete.draft')}
      </DropdownButtonItem>
      <ConfirmDeleteDatasetModal
        show={showConfirmationModal}
        handleClose={handleCloseModal}
        handleDelete={() => handleDeleteDataset(dataset.persistentId)}
        isDeletingDataset={isDeletingDataset}
        errorDeletingDataset={errorDeletingDataset}
      />
    </>
  )
}
