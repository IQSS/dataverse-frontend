import { useDeepCompareEffect } from 'use-deep-compare'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Stack } from '@iqss/dataverse-design-system'
import { useFileUploaderContext } from './context/FileUploaderContext'
import FileUploadInput from './file-upload-input/FileUploadInput'
import { UploadedFilesList } from './uploaded-files-list/UploadedFilesList'
import { UploaderFileRepository } from './types'

export interface FileUploaderPanelCoreProps {
  fileRepository: UploaderFileRepository
  datasetPersistentId: string
  /** Called when user clicks Cancel */
  onCancel: () => void
  /** Called when files are successfully added to dataset */
  onFilesAddedSuccess: () => void
  /** Called when file is successfully replaced (for replace mode) */
  onFileReplacedSuccess?: (newFileId: number) => void
}

export const FileUploaderPanelCore = ({
  fileRepository,
  datasetPersistentId,
  onCancel,
  onFilesAddedSuccess,
  onFileReplacedSuccess
}: FileUploaderPanelCoreProps) => {
  const { t } = useTranslation('shared')

  const {
    fileUploaderState: { replaceOperationInfo, addFilesToDatasetOperationInfo },
    uploadedFiles
  } = useFileUploaderContext()

  useDeepCompareEffect(() => {
    if (replaceOperationInfo.success && replaceOperationInfo.newFileIdentifier) {
      toast.success(t('fileUploader.fileReplacedSuccessfully'))
      onFileReplacedSuccess?.(replaceOperationInfo.newFileIdentifier)
    }

    if (addFilesToDatasetOperationInfo.success) {
      toast.success(t('fileUploader.filesAddedToDatasetSuccessfully'))
      onFilesAddedSuccess()
    }
  }, [
    replaceOperationInfo,
    addFilesToDatasetOperationInfo,
    t,
    onFilesAddedSuccess,
    onFileReplacedSuccess
  ])

  return (
    <Stack gap={4}>
      <FileUploadInput fileRepository={fileRepository} datasetPersistentId={datasetPersistentId} />

      {uploadedFiles.length > 0 && (
        <UploadedFilesList
          fileRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          onCancel={onCancel}
        />
      )}
    </Stack>
  )
}
