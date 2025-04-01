import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { useFile } from '../file/useFile'
import { useLoading } from '../loading/LoadingContext'
import { FileInfo } from './file-info/FileInfo'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { FileUploader, OperationType } from '../shared/file-uploader/FileUploader'
import { ReplaceFileReferrer } from './ReplaceFileFactory'
import styles from './ReplaceFile.module.scss'

interface ReplaceFileProps {
  fileRepository: FileRepository
  fileIdFromParams: number
  datasetPidFromParams: string
  datasetVersionFromParams: string
  referrer?: ReplaceFileReferrer
}

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
      <Tabs defaultActiveKey="files">
        <Tabs.Tab eventKey="files" title={tFiles('files')}>
          <div className={styles.tab_container}>
            <FileUploader
              fileRepository={fileRepository}
              datasetPersistentId={datasetPidFromParams}
              storageType="S3"
              operationType={OperationType.REPLACE_FILE}
              originalFile={file}
              referrer={referrer}
            />
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
