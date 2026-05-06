import { useDeepCompareEffect } from 'use-deep-compare'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Stack } from '@iqss/dataverse-design-system'
import { DatasetUploadLimits } from '@/dataset/domain/models/DatasetUploadLimits'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useFileUploaderContext } from './context/FileUploaderContext'
import FileUploadInput from './file-upload-input/FileUploadInput'
import { UploadedFilesList } from './uploaded-files-list/UploadedFilesList'
import { UploaderFileRepository } from './types'

export interface FileUploaderPanelCoreProps {
  fileRepository: UploaderFileRepository
  datasetRepository?: DatasetRepository
  datasetPersistentId: string
  fetchUploadLimits?: (
    datasetId: string | number,
    datasetRepository: DatasetRepository
  ) => Promise<DatasetUploadLimits>
  /** Called when user clicks Cancel */
  onCancel: () => void
  /** Called when files are successfully added to dataset */
  onFilesAddedSuccess: () => void
  /** Called when file is successfully replaced (for replace mode) */
  onFileReplacedSuccess?: (newFileId: number) => void
}

export const FileUploaderPanelCore = ({
  fileRepository,
  datasetRepository,
  datasetPersistentId,
  fetchUploadLimits,
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
      <FileUploadInput
        fileRepository={fileRepository}
        datasetRepository={datasetRepository}
        datasetPersistentId={datasetPersistentId}
        fetchUploadLimits={fetchUploadLimits}
      />

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
