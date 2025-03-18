import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { ConfirmDeleteFileModal } from '@/sections/file/file-action-buttons/edit-file-menu/delete-file-button/confirm-delete-file-modal/ConfirmDeleteFileModal'
import { EditFileMenuDatasetInfo } from '@/sections/file/file-action-buttons/edit-file-menu/EditFileMenu'
import { useDeleteFile } from '@/sections/file/file-action-buttons/edit-file-menu/delete-file-button/useDeleteFile'
import { useFilesContext } from '@/sections/file/FilesContext'

interface DatasetDeleteFileButtonProps {
  fileId: number
  fileRepository: FileRepository
  datasetInfo: EditFileMenuDatasetInfo
}

export const DatasetDeleteFileButton = ({
  fileId,
  fileRepository,
  datasetInfo
}: DatasetDeleteFileButtonProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('file')

  const { handleDeleteFile, isDeletingFile, errorDeletingFile } = useDeleteFile({
    fileRepository,
    onSuccessfulDelete: closeModalAndNavigateToDataset
  })

  const handleOpenModal = () => setShowConfirmationModal(true)
  const handleCloseModal = () => setShowConfirmationModal(false)
  const { refreshFiles } = useFilesContext()
  const [searchParamsURL] = useSearchParams()
  const urlParams = new URLSearchParams(searchParamsURL)
  const version = urlParams.get(QueryParamKey.VERSION)

  function closeModalAndNavigateToDataset() {
    setShowConfirmationModal(false)

    if (version === 'DRAFT' || version === ':draft') {
      void refreshFiles()
    } else {
      const searchParams = new URLSearchParams()
      searchParams.set(QueryParamKey.PERSISTENT_ID, datasetInfo.persistentId)
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
      navigate(`${Route.DATASETS}?${searchParams.toString()}`)
    }

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
