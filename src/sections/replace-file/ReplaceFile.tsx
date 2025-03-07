import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
import { useFile } from '../file/useFile'
import { useLoading } from '../loading/LoadingContext'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileUploader } from '../shared/file-uploader/FileUploader'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { FileUploadState } from '../shared/file-uploader/fileUploaderReducer'
import { FileInfo } from './file-info/FileInfo'
import styles from './ReplaceFile.module.scss'

interface ReplaceFileProps {
  fileRepository: FileRepository
  fileIdFromParams: number
  datasetPidFromParams: string
  datasetVersionFromParams: string
  referrer?: ReferrerType
}

// TODO:ME - Test removing from bottom file list and upload should be enabled again
// TODO:ME - How to delete a file because its different mime type?
// TODO:ME - How to delete a file because it has the same content?
// TODO:ME - Add restrict file link from dataset files page
// TODO:ME - After uploading files, check existing files with same content in the dataset and show modal to remove duplicate file (should call delete s3 file endpoint?)

export type ReferrerType = 'FILE' | 'DATASET'

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

  const [uploadedFiles, setUploadedFiles] = useState<FileUploadState[]>([])

  useEffect(() => {
    if (!isLoadingFile) {
      setIsLoading(false)
    }
  }, [setIsLoading, isLoadingFile])

  const handleSyncUploadedFiles = useCallback((files: FileUploadState[]) => {
    setUploadedFiles(files)
  }, [])

  if (isLoadingFile) {
    return <AppLoader />
  }

  if (!file) {
    return <PageNotFound />
  }

  console.log(uploadedFiles)
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
            />
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
