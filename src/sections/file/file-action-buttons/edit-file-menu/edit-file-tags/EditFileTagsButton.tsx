import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { EditFileTagsModal } from './edit-file-tags-modal/EditFileTagsModal'
import { useUpdateFileCategories } from './useUpdateFileCategories'
import { useUpdateFileTabularTags } from './useUpdateFileTabularTags'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileLabel } from '@/files/domain/models/FileMetadata'
import { useFilesContext } from '@/sections/file/FilesContext'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'

interface EditFileTagsButtonProps {
  fileId: number
  fileRepository: FileRepository
  existingLabels?: FileLabel[]
  datasetPersistentId: string
  isTabularFile: boolean
}

export const EditFileTagsButton = ({
  fileId,
  fileRepository,
  existingLabels,
  datasetPersistentId,
  isTabularFile
}: EditFileTagsButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation('file')
  const { refreshFiles } = useFilesContext()
  const [searchParamsURL] = useSearchParams()
  const urlParams = new URLSearchParams(searchParamsURL)
  const version = urlParams.get(QueryParamKey.VERSION)
  const navigate = useNavigate()

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  function closeModalAndNavigateToDataset() {
    setIsModalOpen(false)

    if (version === 'DRAFT' || version === ':draft') {
      void refreshFiles()
    } else {
      const searchParams = new URLSearchParams()
      searchParams.set(QueryParamKey.PERSISTENT_ID, datasetPersistentId)
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
      navigate(`${Route.DATASETS}?${searchParams.toString()}`)
    }

    toast.success(t('fileDeletedSuccess'))
  }

  const { handleUpdateCategories, isUpdatingCategories, errorUpdatingCategories } =
    useUpdateFileCategories({
      fileRepository,
      onSuccessfulUpdateCategories: closeModalAndNavigateToDataset
    })

  const { handleUpdateTabularTags, isUpdatingTabularTags, errorUpdatingTabularTags } =
    useUpdateFileTabularTags({
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
      />
    </>
  )
}
