import { useEffect, useState } from 'react'
import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
import styles from './Dataset.module.scss'
import { DatasetLabels } from './dataset-labels/DatasetLabels'
import { useLoading } from '../loading/LoadingContext'
import { DatasetSkeleton, TabsSkeleton } from './DatasetSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { useTranslation } from 'react-i18next'
import { DatasetMetadata } from './dataset-metadata/DatasetMetadata'
import { DatasetSummary } from './dataset-summary/DatasetSummary'
import { DatasetCitation } from './dataset-citation/DatasetCitation'
import { DatasetFiles } from './dataset-files/DatasetFiles'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { DatasetActionButtons } from './dataset-action-buttons/DatasetActionButtons'
import { useDataset } from './DatasetContext'
import { useNotImplementedModal } from '../not-implemented/NotImplementedModalContext'
import { NotImplementedModal } from '../not-implemented/NotImplementedModal'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { Alert, AlertMessageKey } from '../../alert/domain/models/Alert'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetAlerts } from './dataset-alerts/DatasetAlerts'
import { DatasetFilesScrollable } from './dataset-files/DatasetFilesScrollable'
import useCheckPublishCompleted from './useCheckPublishCompleted'
import { useNavigate } from 'react-router-dom'
import { Route } from '../Route.enum'
import { useDeepCompareEffect } from 'use-deep-compare'

interface DatasetProps {
  fileRepository: FileRepository
  datasetRepository: DatasetRepository
  created?: boolean
  metadataUpdated?: boolean
  filesTabInfiniteScrollEnabled?: boolean
  publishInProgress?: boolean
}

export function Dataset({
  fileRepository,
  datasetRepository,
  created,
  metadataUpdated,
  filesTabInfiniteScrollEnabled,
  publishInProgress
}: DatasetProps) {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()
  const { t } = useTranslation('dataset')
  const { hideModal, isModalOpen } = useNotImplementedModal()
  const publishCompleted = useCheckPublishCompleted(publishInProgress, dataset, datasetRepository)
  const navigate = useNavigate()
  // TODO: Move this to custom hook useDatasetAlerts
  const [datasetAlerts, setDatasetAlerts] = useState<Alert[]>([])

  useDeepCompareEffect(() => {
    if (dataset?.alerts) {
      console.log(
        '%cSetting initial dataset alerts',
        'background: red; color: white; padding: 2px;'
      )
      setDatasetAlerts(dataset.alerts)
    }
  }, [dataset?.alerts])

  useEffect(() => {
    if (created && dataset) {
      setDatasetAlerts((prevAlerts) => {
        const datasetCreatedAdded = prevAlerts.some(
          (alert) => alert.messageKey === AlertMessageKey.DATASET_CREATED
        )
        if (datasetCreatedAdded) return prevAlerts

        return [...prevAlerts, { messageKey: AlertMessageKey.DATASET_CREATED, variant: 'success' }]
      })
    }
    if (metadataUpdated && dataset) {
      setDatasetAlerts((prevAlerts) => {
        const metadataUpdatedAdded = prevAlerts.some(
          (alert) => alert.messageKey === AlertMessageKey.METADATA_UPDATED
        )
        if (metadataUpdatedAdded) return prevAlerts

        return [...prevAlerts, { messageKey: AlertMessageKey.METADATA_UPDATED, variant: 'success' }]
      })
    }
  }, [created, metadataUpdated, dataset])

  useEffect(() => {
    if (dataset) {
      console.log('%cRunning effect', 'background: blue; color: white; padding: 2px;')

      if (publishInProgress && !publishCompleted) {
        console.log(
          '%cPublish in progress but not completed',
          'background: orange; color: white; padding: 2px;'
        )

        setDatasetAlerts((prevAlerts) => {
          const publishInProgressAdded = prevAlerts.some(
            (alert) => alert.messageKey === AlertMessageKey.PUBLISH_IN_PROGRESS
          )
          if (publishInProgressAdded) return prevAlerts

          return [{ messageKey: AlertMessageKey.PUBLISH_IN_PROGRESS, variant: 'info' }]
        })
      }
      if (publishInProgress && publishCompleted) {
        console.log(
          '%cPublish in progress and completed',
          'background: green; color: white; padding: 2px;'
        )
        navigate(`${Route.DATASETS}?persistentId=${dataset.persistentId}`, {
          state: { publishInProgress: false },
          replace: true
        })
      }
    }
  }, [dataset, publishInProgress, publishCompleted, navigate])

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
                  <DatasetAlerts alerts={datasetAlerts} />
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
                  <DatasetActionButtons datasetRepository={datasetRepository} dataset={dataset} />
                </Col>
              </Row>
              <Row>
                <Col sm={9} className={styles['summary-container']}>
                  <DatasetSummary summaryFields={dataset.summaryFields} license={dataset.license} />
                </Col>
              </Row>
              {publishInProgress && <TabsSkeleton />}

              {!publishInProgress && (
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
                      />
                    </div>
                  </Tabs.Tab>
                </Tabs>
              )}

              <SeparationLine />
            </div>
          </article>
        </>
      )}
    </>
  )
}
