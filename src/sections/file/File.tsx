import { useTranslation } from 'react-i18next'
import { PageNotFound } from '../page-not-found/PageNotFound'
import styles from './File.module.scss'
import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useFile } from './useFile'
import { useEffect } from 'react'
import { useLoading } from '../loading/LoadingContext'
import { FileSkeleton } from './FileSkeleton'
import { DatasetCitation } from '../dataset/dataset-citation/DatasetCitation'

interface FileProps {
  repository: FileRepository
  id: number
}
export function File({ repository, id }: FileProps) {
  const { setIsLoading } = useLoading()
  const { t } = useTranslation('file')
  const { file, isLoading } = useFile(repository, id)

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  if (isLoading) {
    return <FileSkeleton />
  }

  return (
    <>
      {!file ? (
        <PageNotFound />
      ) : (
        <article>
          <header className={styles.header}>
            <h1>{file.name}</h1>
            <span className={styles.subtext}>
              {t('subtext', { datasetTitle: file.datasetVersion.title })}
            </span>
          </header>
          <div className={styles.container}>
            <Row>
              <Col sm={9}>
                <span className={styles['citation-title']}>{t('datasetCitation')}</span>
                <DatasetCitation version={file.datasetVersion} withoutThumbnail />
              </Col>
            </Row>
            <Tabs defaultActiveKey="metadata">
              <Tabs.Tab eventKey="metadata" title={t('tabs.metadata')}>
                <span></span>
              </Tabs.Tab>
            </Tabs>
            <div className={styles['separation-line']}></div>
          </div>
        </article>
      )}
    </>
  )
}
