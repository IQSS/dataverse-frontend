import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { useNavigate } from 'react-router-dom'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { EditFileTagsModal } from './edit-file-tags-modal/EditFileTagsModal'
import { useUpdateFileCategories } from './useUpdateFileCategories'
import { useUpdateFileTabularTags } from './useUpdateFileTabularTags'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileLabel } from '@/files/domain/models/FileMetadata'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface EditFileTagsButtonProps {
  fileId: number
  fileRepository: FileRepository
  existingLabels?: FileLabel[]
  datasetPersistentId: string
  isTabularFile: boolean
  datasetRepository: DatasetRepository
}

export const EditFileTagsButton = ({
  fileId,
  fileRepository,
  existingLabels,
  datasetPersistentId,
  isTabularFile,
  datasetRepository
}: EditFileTagsButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation('file')
  const navigate = useNavigate()

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  function closeModalAndNavigateToDataset() {
    setIsModalOpen(false)
    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, datasetPersistentId)
    searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    navigate(`${Route.DATASETS}?${searchParams.toString()}`)

    toast.success(t('fileTagsUpdatedSuccess'))
  }

  const {
    handleUpdateCategories,
    isLoading: isUpdatingCategories,
    error: errorUpdatingCategories
  } = useUpdateFileCategories({
    fileRepository,
    onSuccessfulUpdateCategories: closeModalAndNavigateToDataset
  })

  const {
    handleUpdateTabularTags,
    isLoading: isUpdatingTabularTags,
    error: errorUpdatingTabularTags
  } = useUpdateFileTabularTags({
    fileRepository,
    onSuccessfulUpdateTabularTags: closeModalAndNavigateToDataset
  })

  return (
    <>
      <DropdownButtonItem onClick={handleOpenModal}>
        {t('actionButtons.editFileMenu.options.tags')}
      </DropdownButtonItem>
      <EditFileTagsModal
        show={isModalOpen}
        fileId={fileId}
        existingLabels={existingLabels}
        handleClose={handleCloseModal}
        handleUpdateCategories={handleUpdateCategories}
        isUpdatingFileCategories={isUpdatingCategories}
        errorUpdatingFileCategories={errorUpdatingCategories}
        handleUpdateTabularTags={handleUpdateTabularTags}
        isUpdatingTabularTags={isUpdatingTabularTags}
        errorUpdatingTabularTags={errorUpdatingTabularTags}
        isTabularFile={isTabularFile}
        datasetRepository={datasetRepository}
        datasetPersistentId={datasetPersistentId}
      />
    </>
  )
}
