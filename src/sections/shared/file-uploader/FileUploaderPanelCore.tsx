/**
 * Core File Uploader Panel
 *
 * This is the shared core component used by both the SPA (via FileUploaderPanel)
 * and standalone mode (DVWebloader V2). It contains all the UI and logic,
 * but delegates navigation/blocking behavior to the parent via callbacks.
 */

import { useEffect } from 'react'
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
  /**
   * Called to register a cleanup function that should be invoked before leaving.
   * The parent can use this with useBlocker (SPA) or beforeunload (standalone).
   */
  onRegisterUnsavedChangesCheck?: (hasUnsavedChanges: () => boolean) => void
}

export const FileUploaderPanelCore = ({
  fileRepository,
  datasetPersistentId,
  onCancel,
  onFilesAddedSuccess,
  onFileReplacedSuccess,
  onRegisterUnsavedChangesCheck
}: FileUploaderPanelCoreProps) => {
  const { t } = useTranslation('shared')

  const {
    fileUploaderState: {
      files,
      isSaving,
      uploadingToCancelMap,
      replaceOperationInfo,
      addFilesToDatasetOperationInfo
    },
    uploadedFiles
  } = useFileUploaderContext()

  // Register the unsaved changes check with parent
  useEffect(() => {
    if (onRegisterUnsavedChangesCheck) {
      onRegisterUnsavedChangesCheck(() => {
        return Object.keys(files).length > 0 || isSaving || uploadingToCancelMap.size > 0
      })
    }
  }, [files, isSaving, uploadingToCancelMap.size, onRegisterUnsavedChangesCheck])

  // Handle successful operations
  useDeepCompareEffect(() => {
    // Handle replace file success
    if (replaceOperationInfo.success && replaceOperationInfo.newFileIdentifier) {
      toast.success(t('fileUploader.fileReplacedSuccessfully'))
      onFileReplacedSuccess?.(replaceOperationInfo.newFileIdentifier)
    }

    // Handle add files success
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
