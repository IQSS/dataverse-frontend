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
}

export const FileUploaderPanelCore = ({
  fileRepository,
  datasetRepository,
  datasetPersistentId,
  fetchUploadLimits,
  onCancel
}: FileUploaderPanelCoreProps) => {
  const { t } = useTranslation('shared')

  const {
    fileUploaderState: { replaceOperationInfo, addFilesToDatasetOperationInfo },
    uploadedFiles
  } = useFileUploaderContext()

  // Toast on success only. Post-success navigation is owned by each parent
  // (SPA / standalone) so it can be colocated with that parent's blocking
  // mechanism — useBlocker in the SPA, beforeunload in the standalone. Keeping
  // navigate next to useBlocker is what makes React fire the blocker's
  // predicate-update effect before the navigate, so the leave modal doesn't
  // latch on a stale blocker fn.
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
