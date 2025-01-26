import { useEffect } from 'react'
import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
import styles from './Dataset.module.scss'
import { useNavigate } from 'react-router-dom'
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
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetAlerts } from './dataset-alerts/DatasetAlerts'
import { DatasetFilesScrollable } from './dataset-files/DatasetFilesScrollable'
import useCheckPublishCompleted from './useCheckPublishCompleted'
import useUpdateDatasetAlerts from './useUpdateDatasetAlerts'
import { QueryParamKey, Route } from '../Route.enum'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { DatasetTerms } from '@/sections/dataset/dataset-terms/DatasetTerms'

interface DatasetProps {
  datasetRepository: DatasetRepository
  fileRepository: FileRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionRepository: CollectionRepository
  created?: boolean
  metadataUpdated?: boolean
  filesTabInfiniteScrollEnabled?: boolean
  publishInProgress?: boolean
}

export function Dataset({
  datasetRepository,
  fileRepository,
  metadataBlockInfoRepository,
  collectionRepository,
  created,
  metadataUpdated,
  filesTabInfiniteScrollEnabled,
  publishInProgress
}: DatasetProps) {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading: isDatasetLoading } = useDataset()
  const { t } = useTranslation('dataset')
  const navigate = useNavigate()
  const { hideModal, isModalOpen } = useNotImplementedModal()
  const publishCompleted = useCheckPublishCompleted(publishInProgress, dataset, datasetRepository)

  useUpdateDatasetAlerts({
    dataset,
    created,
    metadataUpdated,
    publishInProgress
  })

  useEffect(() => {
    if (publishInProgress && publishCompleted && dataset) {
      navigate(`${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${dataset.persistentId}`, {
        state: {},
        replace: true
      })
    }
  }, [publishInProgress, publishCompleted, dataset, navigate])

  useEffect(() => {
    setIsLoading(isDatasetLoading)
  }, [isDatasetLoading, setIsLoading])

  if (isDatasetLoading && !dataset) {
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
                  <DatasetAlerts />
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
                  <DatasetActionButtons
                    datasetRepository={datasetRepository}
                    collectionRepository={collectionRepository}
                    dataset={dataset}
                  />
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
              {publishInProgress && <TabsSkeleton />}

              {(!publishInProgress || !isDatasetLoading) && (
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
                  <Tabs.Tab title={'Terms'} eventKey={'terms'}>
                    <div className={styles['tab-container']}>
                      <DatasetTerms license={dataset.license} termsOfUse={dataset.termsOfUse} />
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
