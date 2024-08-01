import { useEffect } from 'react'
import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
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
import { DatasetAlerts } from './dataset-alerts/DatasetAlerts'
import { useNotImplementedModal } from '../not-implemented/NotImplementedModalContext'
import { NotImplementedModal } from '../not-implemented/NotImplementedModal'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { useAlertContext } from '../alerts/AlertContext'
import { AlertMessageKey } from '../../alert/domain/models/Alert'
import { DatasetFilesScrollable } from './dataset-files/DatasetFilesScrollable'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

interface DatasetProps {
  fileRepository: FileRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  created?: boolean
  metadataUpdated?: boolean
  filesTabInfiniteScrollEnabled?: boolean
}

export function Dataset({
  fileRepository,
  metadataBlockInfoRepository,
  created,
  metadataUpdated,
  filesTabInfiniteScrollEnabled
}: DatasetProps) {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()
  const { t } = useTranslation('dataset')
  const { hideModal, isModalOpen } = useNotImplementedModal()
  const { addDatasetAlert } = useAlertContext()

  useEffect(() => {
    if (metadataUpdated) {
      addDatasetAlert({ messageKey: AlertMessageKey.METADATA_UPDATED, variant: 'success' })
    }
    if (created) {
      addDatasetAlert({ messageKey: AlertMessageKey.DATASET_CREATED, variant: 'success' })
    }
  }, [metadataUpdated, created, addDatasetAlert])

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  if (isLoading) {
    return <DatasetSkeleton />
  }

  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
      {!dataset ? (
        <PageNotFound />
      ) : (
        <>
          <BreadcrumbsGenerator hierarchy={dataset.hierarchy} />
          <article>
            <div className={styles.container}>
              <Row>
                <Col>
                  <DatasetAlerts alerts={dataset.alerts} />
                </Col>
              </Row>
            </div>

            <header className={styles.header}>
              <h1>{dataset.version.title}</h1>
              <DatasetLabels labels={dataset.version.labels} />
            </header>
            <div className={styles.container}>
              <Row>
                <Col sm={9}>
                  <DatasetCitation thumbnail={dataset.thumbnail} version={dataset.version} />
                </Col>
                <Col sm={3}>
                  <DatasetActionButtons dataset={dataset} />
                </Col>
              </Row>
              <Row>
                <Col sm={9} className={styles['summary-container']}>
                  <DatasetSummary
                    summaryFields={dataset.summaryFields}
                    license={dataset.license}
                    metadataBlockInfoRepository={metadataBlockInfoRepository}
                  />
                </Col>
              </Row>
              <Tabs defaultActiveKey="files">
                <Tabs.Tab eventKey="files" title={t('filesTabTitle')}>
                  <div className={styles['tab-container']}>
                    {filesTabInfiniteScrollEnabled ? (
                      <DatasetFilesScrollable
                        filesRepository={fileRepository}
                        datasetPersistentId={dataset.persistentId}
                        datasetVersion={dataset.version}
                      />
                    ) : (
                      <DatasetFiles
                        filesRepository={fileRepository}
                        datasetPersistentId={dataset.persistentId}
                        datasetVersion={dataset.version}
                      />
                    )}
                  </div>
                </Tabs.Tab>
                <Tabs.Tab eventKey="metadata" title={t('metadataTabTitle')}>
                  <div className={styles['tab-container']}>
                    <DatasetMetadata
                      persistentId={dataset.persistentId}
                      metadataBlocks={dataset.metadataBlocks}
                      metadataBlockInfoRepository={metadataBlockInfoRepository}
                    />
                  </div>
                </Tabs.Tab>
              </Tabs>
              <SeparationLine />
            </div>
          </article>
        </>
      )}
    </>
  )
}
