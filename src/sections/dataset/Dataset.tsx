import { Tabs, Col, Row } from '@iqss/dataverse-design-system'
import styles from './Dataset.module.scss'
import { DatasetLabels } from './dataset-labels/DatasetLabels'
import { useLoading } from '../loading/LoadingContext'
import { DatasetSkeleton } from './DatasetSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { useTranslation } from 'react-i18next'
import { DatasetMetadata } from './dataset-metadata/DatasetMetadata'
import { DatasetSummary } from './dataset-summary/DatasetSummary'
import { DatasetCitation } from './dataset-citation/DatasetCitation'
import { DatasetFiles } from './dataset-files/DatasetFiles'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { DatasetActionButtons } from './dataset-action-buttons/DatasetActionButtons'
import { useDataset } from './DatasetContext'
import { useEffect } from 'react'
import { DatasetAlerts } from './dataset-alerts/DatasetAlerts'
import { useNotImplementedModal } from '../not-implemented/NotImplementedModalContext'
import { NotImplementedModal } from '../not-implemented/NotImplementedModal'

interface DatasetProps {
  fileRepository: FileRepository
}

export function Dataset({ fileRepository }: DatasetProps) {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()
  const { t } = useTranslation('dataset')
  const { showModal, hideModal, isModalOpen } = useNotImplementedModal()

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  if (isLoading) {
    return <DatasetSkeleton />
  }

  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
      {!dataset ? (
        <PageNotFound />
      ) : (
        <article>
          <div className={styles.container}>
            <Row>
              <Col>
                <DatasetAlerts alerts={dataset.alerts} />
              </Col>
            </Row>
          </div>

          <header className={styles.header}>
            <h1>{dataset.getTitle()}</h1>
            <DatasetLabels labels={dataset.labels} />
          </header>
          <div className={styles.container}>
            <Row>
              <Col sm={9}>
                <DatasetCitation
                  title={dataset.getTitle()}
                  thumbnail={dataset.thumbnail}
                  citation={dataset.citation}
                  version={dataset.version}
                />
              </Col>
              <Col sm={3}>
                <DatasetActionButtons dataset={dataset} />
              </Col>
            </Row>
            <Row>
              <Col sm={9} className={styles['summary-container']}>
                <DatasetSummary summaryFields={dataset.summaryFields} license={dataset.license} />
              </Col>
            </Row>
            <Tabs defaultActiveKey="files">
              <Tabs.Tab eventKey="files" title={t('filesTabTitle')}>
                <div className={styles['tab-container']}>
                  <DatasetFiles
                    filesRepository={fileRepository}
                    datasetPersistentId={dataset.persistentId}
                    datasetVersion={dataset.version}
                  />
                </div>
              </Tabs.Tab>
              <Tabs.Tab eventKey="metadata" title={t('metadataTabTitle')}>
                <div className={styles['tab-container']}>
                  <DatasetMetadata
                    persistentId={dataset.persistentId}
                    metadataBlocks={dataset.metadataBlocks}
                  />
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
