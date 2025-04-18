import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { RouteWithParams } from '@/sections/Route.enum'
import { Dataset, DatasetPublishingStatus } from '../../../../../dataset/domain/models/Dataset'
import { useDeleteDraftDataset } from './useDeleteDraftDataset'
import { DropdownButtonItem, DropdownSeparator } from '@iqss/dataverse-design-system'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersion } from '@/dataset/domain/models/Dataset'
import { ConfirmDeleteDraftDatasetModal } from './ConfirmDeleteDraftDatasetModal'

interface DeleteDraftDatasetButtonProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
}
export function DeleteDraftDatasetButton({
  dataset,
  datasetRepository
}: DeleteDraftDatasetButtonProps) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('dataset')

  const handleOpenModal = () => setShowConfirmationModal(true)
  const handleCloseModal = () => setShowConfirmationModal(false)

  const { handleDeleteDraftDataset, isDeletingDataset, errorDeletingDataset } =
    useDeleteDraftDataset({
      datasetRepository,
      onSuccessfulDelete: closeModalAndNavigateToDataset
    })

  function closeModalAndNavigateToDataset() {
    handleCloseModal()

    if (!dataset.version.someDatasetVersionHasBeenReleased) {
      navigate(RouteWithParams.COLLECTIONS(dataset.hierarchy.id))
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
          ? t('datasetActionButtons.editDataset.delete.draft')
          : t('datasetActionButtons.editDataset.delete.released')}
      </DropdownButtonItem>
      <ConfirmDeleteDraftDatasetModal
        show={showConfirmationModal}
        handleClose={handleCloseModal}
        handleDelete={() => handleDeleteDraftDataset(dataset.persistentId)}
        isDeletingDataset={isDeletingDataset}
        errorDeletingDataset={errorDeletingDataset}
      />
    </>
  )
}
