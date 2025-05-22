import { useRef, useEffect, useState } from 'react'
import { Col, Row, Tabs } from '@iqss/dataverse-design-system'
import styles from './Dataset.module.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DatasetLabels } from './dataset-labels/DatasetLabels'
import { useLoading } from '../loading/LoadingContext'
import { DatasetSkeleton, TabsSkeleton } from './DatasetSkeleton'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
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
import { DatasetVersions } from './dataset-versions/DatasetVersions'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { DatasetMetrics } from './dataset-metrics/DatasetMetrics'

interface DatasetProps {
  datasetRepository: DatasetRepository
  fileRepository: FileRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionRepository: CollectionRepository
  contactRepository: ContactRepository
  filesTabInfiniteScrollEnabled?: boolean
  publishInProgress?: boolean
  tab?: string
}

export function Dataset({
  datasetRepository,
  fileRepository,
  metadataBlockInfoRepository,
  collectionRepository,
  contactRepository,
  filesTabInfiniteScrollEnabled,
  publishInProgress,
  tab = 'files'
}: DatasetProps) {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading: isDatasetLoading } = useDataset()
  const { t } = useTranslation('dataset')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { hideModal, isModalOpen } = useNotImplementedModal()
  const publishCompleted = useCheckPublishCompleted(publishInProgress, dataset, datasetRepository)
  const [activeTab, setActiveTab] = useState<string>(tab)
  const termsTabRef = useRef<HTMLDivElement>(null)
  useUpdateDatasetAlerts({
    dataset,
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

  if (!dataset) {
    return <NotFoundPage dvObjectNotFoundType="dataset" />
  }

  const handleCustomTermsClick = () => {
    setActiveTab('terms')
    const newParams = new URLSearchParams(searchParams)
    newParams.set('tab', 'terms')
    // Update URL without reloading
    navigate(`?${newParams.toString()}`, { replace: true })
    termsTabRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key)
    }
  }
  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />

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
            <Col lg={9} className="mb-4">
              <DatasetCitation thumbnail={dataset.thumbnail} version={dataset.version} />
              <DatasetSummary
                summaryFields={dataset.summaryFields}
                license={dataset.license}
                onCustomTermsClick={handleCustomTermsClick}
                metadataBlockInfoRepository={metadataBlockInfoRepository}
              />
            </Col>
            <Col lg={3}>
              <DatasetActionButtons
                datasetRepository={datasetRepository}
                collectionRepository={collectionRepository}
                dataset={dataset}
                contactRepository={contactRepository}
              />
              <DatasetMetrics
                datasetRepository={datasetRepository}
                datasetId={dataset.persistentId}
              />
            </Col>
          </Row>

          {publishInProgress && <TabsSkeleton />}

          {(!publishInProgress || !isDatasetLoading) && (
            <Tabs defaultActiveKey={activeTab} onSelect={handleTabSelect}>
              <Tabs.Tab eventKey="files" title={t('filesTabTitle')}>
                <div className={styles['tab-container']}>
                  {filesTabInfiniteScrollEnabled ? (
                    <DatasetFilesScrollable
                      filesRepository={fileRepository}
                      datasetPersistentId={dataset.persistentId}
                      datasetVersion={dataset.version}
                      key={dataset.version.publishingStatus}
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

              <Tabs.Tab eventKey="terms" title={t('termsTabTitle')}>
                <div ref={termsTabRef} className={styles['tab-container']}>
                  <DatasetTerms
                    license={dataset.license}
                    termsOfUse={dataset.termsOfUse}
                    filesRepository={fileRepository}
                    datasetPersistentId={dataset.persistentId}
                    datasetVersion={dataset.version}
                  />
                </div>
              </Tabs.Tab>

              <Tabs.Tab eventKey="versions" title={t('Versions')}>
                <div className={styles['tab-container']}>
                  <DatasetVersions
                    datasetRepository={datasetRepository}
                    datasetId={dataset.persistentId}
                    key={dataset.version.publishingStatus}
                  />
                </div>
              </Tabs.Tab>
            </Tabs>
          )}

          <SeparationLine />
        </div>
      </article>
    </>
  )
}
