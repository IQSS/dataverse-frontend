import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { ConfirmDeleteFileModal } from './confirm-delete-file-modal/ConfirmDeleteFileModal'
import { EditFileMenuDatasetInfo } from '../EditFileMenu'
import { useDeleteFile } from './useDeleteFile'

interface DeleteFileButtonProps {
  fileId: number
  fileRepository: FileRepository
  datasetInfo: EditFileMenuDatasetInfo
}

export const DeleteFileButton = ({
  fileId,
  fileRepository,
  datasetInfo
}: DeleteFileButtonProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('file')

  const { handleDeleteFile, isDeletingFile, errorDeletingFile } = useDeleteFile({
    fileRepository,
    onSuccessfulDelete: closeModalAndNavigateToDataset
  })

  const handleOpenModal = () => setShowConfirmationModal(true)
  const handleCloseModal = () => setShowConfirmationModal(false)

  function closeModalAndNavigateToDataset() {
    setShowConfirmationModal(false)
    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, datasetInfo.persistentId)
    searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    navigate(`${Route.DATASETS}?${searchParams.toString()}`)

    toast.success(t('fileDeletedSuccess'))
  }

  return (
    <>
      <DropdownButtonItem onClick={handleOpenModal}>
        {t('actionButtons.editFileMenu.options.delete')}
      </DropdownButtonItem>
      <ConfirmDeleteFileModal
        show={showConfirmationModal}
        handleClose={handleCloseModal}
        handleDelete={() => handleDeleteFile(fileId)}
        datasetReleasedVersionExists={datasetInfo.releasedVersionExists}
        isDeletingFile={isDeletingFile}
        errorDeletingFile={errorDeletingFile}
      />
    </>
  )
}
