import { useMemo } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useBlocker, useNavigate } from 'react-router-dom'
import { Stack } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { ReplaceFileReferrer } from '@/sections/replace-file/ReplaceFileFactory'
import { useFileUploaderContext } from './context/FileUploaderContext'
import FileUploadInput from './file-upload-input/FileUploadInput'
import { UploadedFilesList } from './uploaded-files-list/UploadedFilesList'
import { ConfirmLeaveModal } from './confirm-leave-modal/ConfirmLeaveModal'

interface FileUploaderPanelProps {
  fileRepository: FileRepository
  datasetPersistentId: string
  referrer?: ReplaceFileReferrer
}

const FileUploaderPanel = ({
  fileRepository,
  datasetPersistentId,
  referrer
}: FileUploaderPanelProps) => {
  const { t } = useTranslation('shared')
  const navigate = useNavigate()

  const {
    fileUploaderState: {
      files,
      isSaving,
      uploadingToCancelMap,
      replaceOperationInfo,
      addFilesToDatasetOperationInfo
    },
    uploadedFiles,
    removeAllFiles
  } = useFileUploaderContext()

  const shouldBlockAwayNavigation = useMemo(() => {
    return Object.keys(files).length > 0 || isSaving || uploadingToCancelMap.size > 0
  }, [files, isSaving, uploadingToCancelMap.size])

  const navigationBlocker = useBlocker(shouldBlockAwayNavigation)

  const handleConfirmLeavePage = () => {
    if (navigationBlocker.state === 'blocked') {
      // TODO - Remove the files from the S3 bucket we need an API endpoint for this.

      removeAllFiles()

      // Cancel all the uploading files if there are any
      if (uploadingToCancelMap.size > 0) {
        uploadingToCancelMap.forEach((cancel) => {
          cancel()
        })
      }
      navigationBlocker.proceed()
    }
  }

  const handleCancelLeavePage = () => {
    if (navigationBlocker.state === 'blocked') {
      navigationBlocker.reset()
    }
  }

  useDeepCompareEffect(() => {
    const datasetPageRedirectUrl = `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${datasetPersistentId}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`

    // Listens to the replace operation info result and navigates to the new file page if the operation was successful
    if (replaceOperationInfo.success && replaceOperationInfo.newFileIdentifier) {
      toast.success(t('fileUploader.fileReplacedSuccessfully'))

      if (referrer === ReplaceFileReferrer.DATASET) {
        navigate(datasetPageRedirectUrl)
      }

      if (referrer === ReplaceFileReferrer.FILE) {
        navigate(
          `${Route.FILES}?id=${replaceOperationInfo.newFileIdentifier}&${QueryParamKey.DATASET_VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
        )
      }
    }

    // Listens to the add files to dataset operation info result and navigates to the dataset page if the operation was successful
    if (addFilesToDatasetOperationInfo.success) {
      toast.success(t('fileUploader.filesAddedToDatasetSuccessfully'))
      navigate(datasetPageRedirectUrl)
    }
  }, [
    replaceOperationInfo,
    addFilesToDatasetOperationInfo,
    datasetPersistentId,
    t,
    navigate,
    referrer
  ])

  return (
    <Stack gap={4}>
      <FileUploadInput fileRepository={fileRepository} datasetPersistentId={datasetPersistentId} />

      {uploadedFiles.length > 0 && (
        <UploadedFilesList
          fileRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
        />
      )}

      <ConfirmLeaveModal
        show={navigationBlocker.state === 'blocked'}
        onStay={handleCancelLeavePage}
        onLeave={handleConfirmLeavePage}
      />
    </Stack>
  )
}

export default FileUploaderPanel
