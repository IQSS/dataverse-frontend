import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { useDataset } from './useDataset'
import { Tabs, Col, Row } from 'dataverse-design-system'
import styles from './Dataset.module.scss'
import { DatasetLabels } from './dataset-labels/DatasetLabels'
import { useLoading } from '../loading/LoadingContext'
import { DatasetSkeleton } from './DatasetSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { useTranslation } from 'react-i18next'
import { DatasetSummary } from './dataset-summary/DatasetSummary'

interface DatasetProps {
  datasetRepository: DatasetRepository
  id: string
}

export function Dataset({ datasetRepository, id }: DatasetProps) {
  const { dataset } = useDataset(datasetRepository, id)
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
              <DatasetSummary
                summaryFields={dataset.summaryFields}
                license={dataset.license}></DatasetSummary>
            </Row>
            <Tabs defaultActiveKey="files">
              <Tabs.Tab eventKey="files" title={t('filesTabTitle')}>
                <div>Files Section</div>
              </Tabs.Tab>
              <Tabs.Tab eventKey="metadata" title={t('metadataTabTitle')}>
                <div>Metadata Section</div>
              </Tabs.Tab>
            </Tabs>
          </div>
        </article>
      )}
    </>
  )
}
