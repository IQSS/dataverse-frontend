import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { ConfirmRestrictFileModal } from '@/sections/file/file-action-buttons/edit-file-menu/restrict-file-button/confirm-restrict-file-modal/ConfirmRestrictFileModal'
import { useRestrictFile } from '@/sections/file/file-action-buttons/edit-file-menu/restrict-file-button/useRestrictFile'
import { useFilesContext } from '@/sections/file/FilesContext'
import { EditFilesMenuDatasetInfo } from './EditFilesOptions'

interface DatasetRestrictFileButtonProps {
  fileId: number
  isRestricted: boolean
  fileRepository: FileRepository
  datasetInfo: EditFilesMenuDatasetInfo
}

export const DatasetRestrictFileButton = ({
  fileId,
  isRestricted,
  fileRepository,
  datasetInfo
}: DatasetRestrictFileButtonProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('file')
  const { handleRestrictFile, isRestrictingFile, errorRestrictingFile } = useRestrictFile({
    isRestricted,
    fileRepository,
    onSuccessfulRestrict: closeModalAndNavigateToDataset
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
    isRestricted
      ? toast.success(t('restriction.fileUnrestrictedSuccess'))
      : toast.success(t('restriction.fileRestrictdSuccess'))
  }
  return (
    <>
      <DropdownButtonItem onClick={handleOpenModal}>
        {isRestricted
          ? t('actionButtons.editFileMenu.options.unrestrict')
          : t('actionButtons.editFileMenu.options.restrict')}
      </DropdownButtonItem>
      <ConfirmRestrictFileModal
        show={showConfirmationModal}
        handleClose={handleCloseModal}
        handleRestrict={(enableAccessRequest, terms) =>
          handleRestrictFile(fileId, enableAccessRequest, terms || undefined)
        }
        requestAccess={datasetInfo.requestAccess}
        datasetReleasedVersionExists={datasetInfo.releasedVersionExists}
        termsOfAccessForRestrictedFiles={datasetInfo.termsOfAccessForRestrictedFiles}
        isRestrictingFile={isRestrictingFile}
        errorRestrictingFile={errorRestrictingFile}
        isRestricted={isRestricted}
      />
    </>
  )
}
