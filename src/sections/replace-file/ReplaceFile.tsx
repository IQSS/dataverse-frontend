import { useEffect } from 'react'
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
  referrer: ReferrerType
}

//TODO:ME - Add restrict file link from dataset files page

export type ReferrerType = 'FILE' | 'DATASET'

export const ReplaceFile = ({
  fileRepository,
  fileIdFromParams,
  datasetPidFromParams,
  datasetVersionFromParams,
  referrer
}: ReplaceFileProps) => {
  const { t } = useTranslation('replaceFile')
  const { t: tFiles } = useTranslation('files')
  const { setIsLoading } = useLoading()
  const { file, isLoading: isLoadingFile } = useFile(
    fileRepository,
    fileIdFromParams,
    datasetVersionFromParams
  )

  useEffect(() => {
    if (!isLoadingFile) {
      setIsLoading(false)
    }
  }, [setIsLoading, isLoadingFile])

  if (isLoadingFile) {
    return <AppLoader />
  }

  if (!file) {
    return <PageNotFound />
  }

  const handleUploadedFiles = (files: FileUploadState[]) => {
    // console.group('Uploaded files from callback')
    // console.log(files)
    // console.groupEnd()
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
          <strong>{t('originalFile')}</strong>
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
              onUploadedFiles={handleUploadedFiles}
              storageConfiguration="S3"
              multiple={true} // TODO:ME - Change to false here, should allow only one, Also test removing from bottom file list and upload should be enabled again
            />
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
