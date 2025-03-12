import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { UploadedFileInfo } from './uploaded-files-list/UploadedFileInfo'
import { UploadedFilesListHelper } from './uploaded-files-list/UploadedFilesListHelper'
import { FilesListFormData, UploadedFilesList } from './uploaded-files-list/UploadedFilesList'
import FileUploader, { FileUploaderRef } from './FileUploader'
import { FileUploadState } from './fileUploaderReducer'
import styles from './FileUploaderPanel.module.scss'
import { useBlocker } from 'react-router-dom'
import { ConfirmLeaveModal } from './confirm-leave-modal/ConfirmLeaveModal'
import { File } from '@/files/domain/models/File'

type FileUploaderPanelProps =
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageConfiguration: FileStorageConfiguration
      multiple: boolean
      replaceFile?: false
      originalFile?: never
      onSaveChanges: (data: FilesListFormData) => Promise<void>
      isSaving: boolean
      saveSucceeded: boolean
    }
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageConfiguration: FileStorageConfiguration
      multiple: false
      replaceFile: true
      originalFile: File
      onSaveChanges: (data: FilesListFormData) => Promise<void>
      isSaving: boolean
      saveSucceeded: boolean
    }

type FileStorageConfiguration = 'S3'

export const FileUploaderPanel = ({
  fileRepository,
  datasetPersistentId,
  storageConfiguration,
  multiple,
  replaceFile,
  originalFile,
  onSaveChanges,
  isSaving,
  saveSucceeded
}: FileUploaderPanelProps) => {
  const { t: tFiles } = useTranslation('files')
  const fileUploaderRef = useRef<FileUploaderRef>(null)
  const [uploadedFilesInfo, setUploadedFilesInfo] = useState<UploadedFileInfo[]>(
    []
    // UploadedFilesListHelper.mapUploadedFilesToUploadedFileInfo(Object.values(mockFileUploadState))
  )

  // Block navigation if there are files in progress or already uploaded
  const navigationBlocker = useBlocker(uploadedFilesInfo.length > 0)

  const handleConfirmLeavePage = () => {
    if (navigationBlocker.state === 'blocked') {
      // TODO - Remove already uploaded files from the bucket, we need an endpoint for this
      navigationBlocker.proceed()
    }
  }

  const handleCancelLeavePage = () => {
    if (navigationBlocker.state === 'blocked') {
      navigationBlocker.reset()
    }
  }

  const handleSyncUploadedFiles = useCallback((files: FileUploadState[]) => {
    const uploadedFilesMapped = UploadedFilesListHelper.mapUploadedFilesToUploadedFileInfo(files)
    setUploadedFilesInfo(uploadedFilesMapped)
  }, [])

  const handleRemoveFileFromFileUploaderState = (fileKey: string) => {
    fileUploaderRef.current?.removeUploadedFile(fileKey)
  }

  // After saving successfully, remove the uploaded files from the state and unblock navigation
  useEffect(() => {
    if (saveSucceeded) {
      setUploadedFilesInfo([])
      if (navigationBlocker.state === 'blocked') {
        navigationBlocker.proceed()
      }
    }
  }, [saveSucceeded, navigationBlocker])

  return (
    <>
      <Tabs defaultActiveKey="metadata">
        <Tabs.Tab eventKey="metadata" title={tFiles('files')}>
          <div className={styles.tab_container}>
            <FileUploader
              fileRepository={fileRepository}
              datasetPersistentId={datasetPersistentId}
              onUploadedFiles={handleSyncUploadedFiles}
              storageConfiguration={storageConfiguration}
              replaceFile={replaceFile}
              originalFile={originalFile}
              multiple={multiple}
              isSaving={isSaving}
              ref={fileUploaderRef}
            />
          </div>
        </Tabs.Tab>
      </Tabs>

      {uploadedFilesInfo.length > 0 && (
        <UploadedFilesList
          uploadedFilesInfo={uploadedFilesInfo}
          onSaveChanges={onSaveChanges}
          removeFileFromFileUploaderState={handleRemoveFileFromFileUploaderState}
          replaceFile={replaceFile}
          originalFile={originalFile}
          isSaving={isSaving}
        />
      )}
      <ConfirmLeaveModal
        show={navigationBlocker.state === 'blocked'}
        handleCancelLeavePage={handleCancelLeavePage}
        handleConfirmLeavePage={handleConfirmLeavePage}
      />
    </>
  )
}
