import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { ConfirmRestrictFileModal } from './confirm-restrict-file-modal/ConfirmRestrictFileModal'
import { EditFileMenuDatasetInfo } from '../EditFileMenu'
import { useRestrictFile } from './useRestrictFile'

interface RestrictFileButtonProps {
  fileId: number
  isRestricted: boolean
  fileRepository: FileRepository
  datasetInfo: EditFileMenuDatasetInfo
}

export const RestrictFileButton = ({
  fileId,
  isRestricted,
  fileRepository,
  datasetInfo
}: RestrictFileButtonProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('file')
  // const [isNavigate, setIsNavigat] = useState(false)
  const { handleRestrictFile, isRestrictingFile, errorRestrictingFile } = useRestrictFile({
    isRestricted,
    fileRepository,
    onSuccessfulRestrict: closeModalAndNavigateToDataset
  })
  const handleOpenModal = () => setShowConfirmationModal(true)
  const handleCloseModal = () => setShowConfirmationModal(false)

  function closeModalAndNavigateToDataset() {
    setShowConfirmationModal(false)

    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, datasetInfo.persistentId)
    searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    navigate(`${Route.DATASETS}?${searchParams.toString()}`)

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
        handleRestrict={() => handleRestrictFile(fileId)}
        datasetReleasedVersionExists={datasetInfo.releasedVersionExists}
        termsOfAccessForRestrictedFiles={datasetInfo.termsOfAccessForRestrictedFiles}
        isRestrictingFile={isRestrictingFile}
        errorRestrictingFile={errorRestrictingFile}
        isRestricted={isRestricted}
      />
    </>
  )
}
