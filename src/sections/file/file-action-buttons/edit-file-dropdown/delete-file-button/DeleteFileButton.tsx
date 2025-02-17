import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { ConfirmDeleteFileModal } from './ConfirmDeleteFileModal'
import { EditFileDropdownDatasetInfo } from '../EditFileDropdown'
import { useDeleteFile } from './useDeleteFile'

interface DeleteFileButtonProps {
  fileId: number
  fileRepository: FileRepository
  datasetInfo: EditFileDropdownDatasetInfo
}

export const DeleteFileButton = ({
  fileId,
  fileRepository,
  datasetInfo
}: DeleteFileButtonProps) => {
  const { t } = useTranslation('file')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const { handleDeleteFile, isDeletingFile, errorDeletingFile } = useDeleteFile({
    fileRepository,
    onSuccessfulDelete: closeModalAndNavigateToDataset
  })

  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  function closeModalAndNavigateToDataset() {
    setShowModal(false)

    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, datasetInfo.persistentId)

    if (datasetInfo.isDraft) {
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    }
    navigate(`${Route.DATASETS}?${searchParams.toString()}`)

    toast.success(t('fileDeletedSuccess'))
  }

  return (
    <>
      <DropdownButtonItem onClick={handleOpenModal}>
        {t('actionButtons.editFileDropdown.options.delete')}
      </DropdownButtonItem>
      <ConfirmDeleteFileModal
        show={showModal}
        handleClose={handleCloseModal}
        handleDelete={() => handleDeleteFile(fileId)}
        datasetReleasedVersionExists={datasetInfo.releasedVersionExists}
        isDeletingFile={isDeletingFile}
        errorDeletingFile={errorDeletingFile}
      />
    </>
  )
}
