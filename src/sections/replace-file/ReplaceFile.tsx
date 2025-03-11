import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
import { useFile } from '../file/useFile'
import { useLoading } from '../loading/LoadingContext'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import FileUploader, { FileUploaderRef } from '../shared/file-uploader/FileUploader'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { FileUploadState, mockFileUploadState } from '../shared/file-uploader/fileUploaderReducer'
import { FileInfo } from './file-info/FileInfo'
import { UploadedFilesList } from './uploaded-files-list/UploadedFilesList'
import { UploadedFilesListHelper } from './uploaded-files-list/UploadedFilesListHelper'
import { UploadedFileInfo } from './uploaded-files-list/UploadedFileInfo'
import styles from './ReplaceFile.module.scss'

interface ReplaceFileProps {
  fileRepository: FileRepository
  fileIdFromParams: number
  datasetPidFromParams: string
  datasetVersionFromParams: string
}

// TODO - We need something to check if the file has the same content as the original file. Easy for replacement, but what about adding new files to a dataset?
// TODO:ME - Add restrict file link from dataset files page
// TODO:ME - Check current file mime type and if different from new file then forceReplace = true
// TODO:ME Use the dto mapper before submitting the files
// TODO:ME - Use useBlocker to prevent user from leaving the page while uploading files, if continue leaving, abort current uploads

export const ReplaceFile = ({
  fileRepository,
  fileIdFromParams,
  datasetPidFromParams,
  datasetVersionFromParams
}: ReplaceFileProps) => {
  const { t } = useTranslation('replaceFile')
  const { t: tFiles } = useTranslation('files')
  const { setIsLoading } = useLoading()
  const { file, isLoading: isLoadingFile } = useFile(
    fileRepository,
    fileIdFromParams,
    datasetVersionFromParams
  )
  const fileUploaderRef = useRef<FileUploaderRef>(null)
  const [uploadedFilesInfo, setUploadedFilesInfo] = useState<UploadedFileInfo[]>(
    []
    // UploadedFilesListHelper.mapUploadedFilesToUploadedFileInfo(Object.values(mockFileUploadState))
  )

  useEffect(() => {
    if (!isLoadingFile) {
      setIsLoading(false)
    }
  }, [setIsLoading, isLoadingFile])

  const handleSyncUploadedFiles = useCallback((files: FileUploadState[]) => {
    const newUploadedFilesMapped = UploadedFilesListHelper.mapUploadedFilesToUploadedFileInfo(files)
    setUploadedFilesInfo(newUploadedFilesMapped)
  }, [])

  const handleRemoveFileFromFileUploaderState = (fileKey: string) => {
    fileUploaderRef.current?.removeUploadedFile(fileKey)
  }

  if (isLoadingFile) {
    return <AppLoader />
  }

  if (!file) {
    return <PageNotFound />
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={file.hierarchy}
        withActionItem
        actionItemText={t('pageTitle')}
      />
      <Row className={styles.original_file_info_container}>
        <Col md={2}>
          <span>
            <strong>{t('originalFile')}</strong>
          </span>
        </Col>
        <Col md={10}>
          <FileInfo file={file} />
        </Col>
      </Row>

      <Tabs defaultActiveKey="metadata">
        <Tabs.Tab eventKey="metadata" title={tFiles('files')}>
          <div className={styles.tab_container}>
            <FileUploader
              fileRepository={fileRepository}
              datasetPersistentId={datasetPidFromParams}
              onUploadedFiles={handleSyncUploadedFiles}
              storageConfiguration="S3"
              replaceFile={true}
              originalFileType={file.metadata.type.value}
              multiple={false}
              ref={fileUploaderRef}
            />
          </div>
        </Tabs.Tab>
      </Tabs>

      {uploadedFilesInfo.length > 0 && (
        <UploadedFilesList
          uploadedFilesInfo={uploadedFilesInfo}
          removeFileFromFileUploaderState={handleRemoveFileFromFileUploaderState}
        />
      )}
    </section>
  )
}
