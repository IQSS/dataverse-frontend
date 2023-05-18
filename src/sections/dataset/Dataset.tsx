import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { useDataset } from './useDataset'
import { Tabs, Col, Row } from 'dataverse-design-system'
import styles from './Dataset.module.scss'
import { DatasetLabels } from './dataset-labels/DatasetLabels'
import { useLoading } from '../loading/LoadingContext'
import { DatasetSkeleton } from './DatasetSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { useTranslation } from 'react-i18next'
import { DatasetMetadata } from './dataset-metadata/DatasetMetadata'
import { DatasetSummary } from './dataset-summary/DatasetSummary'

interface DatasetProps {
  repository: DatasetRepository
  id: string
}

export function Dataset({ repository, id }: DatasetProps) {
  const { dataset } = useDataset(repository, id)
  const { isLoading } = useLoading()
  const { t } = useTranslation('dataset')

  if (isLoading) {
    return <DatasetSkeleton />
  }

  return (
    <>
      {!dataset ? (
        <PageNotFound />
      ) : (
        <article>
          <header className={styles.header}>
            <h1>{dataset.title}</h1>
            <DatasetLabels labels={dataset.labels} />
          </header>
          <div className={styles.container}>
            <Row>
              <Col sm={9}>Citation Block</Col>
            </Row>
            <Row>
              <Col sm={9}>
                <DatasetSummary
                  summaryFields={dataset.summaryFields}
                  license={dataset.license}></DatasetSummary>
              </Col>
            </Row>
            <Tabs defaultActiveKey="files">
              <Tabs.Tab eventKey="files" title={t('filesTabTitle')}>
                <div className={styles['tab-container']}>
                  <div>Files Section</div>
                </div>
              </Tabs.Tab>
              <Tabs.Tab eventKey="metadata" title={t('metadataTabTitle')}>
                <div className={styles['tab-container']}>
                  <DatasetMetadata metadataBlocks={dataset.metadataBlocks} />
                </div>
              </Tabs.Tab>
            </Tabs>
            <div className={styles['separation-line']}></div>
          </div>
        </article>
      )}
    </>
  )
}
