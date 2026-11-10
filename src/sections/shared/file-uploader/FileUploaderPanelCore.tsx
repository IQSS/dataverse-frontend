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
  datasetPersistentId: string
  fetchUploadLimits?: (
    datasetId: string | number,
    datasetRepository: DatasetRepository
  ) => Promise<DatasetUploadLimits>
  onCancel: () => void
}

export const FileUploaderPanelCore = ({
  fileRepository,
  datasetPersistentId,
  fetchUploadLimits,
  onCancel
}: FileUploaderPanelCoreProps) => {
  const { t } = useTranslation('shared')

  const {
    fileUploaderState: { replaceOperationInfo, addFilesToDatasetOperationInfo },
    uploadedFiles
  } = useFileUploaderContext()

  useDeepCompareEffect(() => {
    if (replaceOperationInfo.success && replaceOperationInfo.newFileIdentifier) {
      toast.success(t('fileUploader.fileReplacedSuccessfully'))
    }

    if (addFilesToDatasetOperationInfo.success) {
      toast.success(t('fileUploader.filesAddedToDatasetSuccessfully'))
    }
  }, [replaceOperationInfo, addFilesToDatasetOperationInfo, t])

  return (
    <Stack gap={4}>
      <FileUploadInput
        fileRepository={fileRepository}
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
