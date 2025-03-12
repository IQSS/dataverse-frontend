import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { UploadedFileInfo } from './uploaded-files-list/UploadedFileInfo'
import { UploadedFilesListHelper } from './uploaded-files-list/UploadedFilesListHelper'
import { FilesListFormData, UploadedFilesList } from './uploaded-files-list/UploadedFilesList'
import FileUploader, { FileUploaderRef } from './FileUploader'
import { FileUploadState } from './fileUploaderReducer'
import styles from './FileUploaderPanel.module.scss'

type FileUploaderPanelProps =
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageConfiguration: FileStorageConfiguration
      multiple: boolean
      replaceFile?: false
      originalFileType?: never
      onSaveChanges: (data: FilesListFormData) => Promise<void>
    }
  | {
      fileRepository: FileRepository
      datasetPersistentId: string
      storageConfiguration: FileStorageConfiguration
      multiple: false
      replaceFile: true
      originalFileType: string
      onSaveChanges: (data: FilesListFormData) => Promise<void>
    }

type FileStorageConfiguration = 'S3'

export const FileUploaderPanel = ({
  fileRepository,
  datasetPersistentId,
  storageConfiguration,
  multiple,
  replaceFile,
  originalFileType,
  onSaveChanges
}: FileUploaderPanelProps) => {
  const { t: tFiles } = useTranslation('files')
  const fileUploaderRef = useRef<FileUploaderRef>(null)
  const [uploadedFilesInfo, setUploadedFilesInfo] = useState<UploadedFileInfo[]>(
    []
    // UploadedFilesListHelper.mapUploadedFilesToUploadedFileInfo(Object.values(mockFileUploadState))
  )

  const handleSyncUploadedFiles = useCallback((files: FileUploadState[]) => {
    const uploadedFilesMapped = UploadedFilesListHelper.mapUploadedFilesToUploadedFileInfo(files)
    setUploadedFilesInfo(uploadedFilesMapped)
  }, [])

  const handleRemoveFileFromFileUploaderState = (fileKey: string) => {
    fileUploaderRef.current?.removeUploadedFile(fileKey)
  }
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
              originalFileType={originalFileType}
              multiple={multiple}
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
        />
      )}
    </>
  )
}
