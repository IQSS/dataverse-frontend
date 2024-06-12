import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Tabs } from '@iqss/dataverse-design-system'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useDataset } from '../dataset/DatasetContext'
import { useLoading } from '../loading/LoadingContext'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { HostCollection } from './HostCollection'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { DatasetMetadataForm } from '../shared/form/DatasetMetadataForm'
import { UpwardHierarchyNode } from '../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import styles from './EditDatasetMetadata.module.scss'

interface EditDatasetMetadataProps {
  datasetRepository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export const EditDatasetMetadataSection = ({
  datasetRepository,
  metadataBlockInfoRepository
}: EditDatasetMetadataProps) => {
  const { t } = useTranslation('editDatasetMetadata')
  const { dataset, isLoading } = useDataset()
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  const datasetParentCollection: UpwardHierarchyNode = useMemo(
    () =>
      dataset?.hierarchy
        .toArray()
        .filter((item) => item.type === 'collection')
        .at(-1) as UpwardHierarchyNode,
    [dataset]
  )

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {!dataset ? (
        <PageNotFound />
      ) : (
        <>
          <BreadcrumbsGenerator
            hierarchy={dataset?.hierarchy}
            withActionItem
            actionItemText={t('breadcrumbActionItem')}
          />
          <Alert variant="info" customHeading={t('infoAlert.heading')}>
            {t('infoAlert.text')}
          </Alert>
          <HostCollection collectionName={datasetParentCollection?.name} />
          <SeparationLine />
          <Tabs defaultActiveKey="metadata">
            <Tabs.Tab eventKey="metadata" title={t('metadata')}>
              <div className={styles['tab-container']}>
                <DatasetMetadataForm
                  mode="edit"
                  collectionId={datasetParentCollection?.id}
                  datasetRepository={datasetRepository}
                  metadataBlockInfoRepository={metadataBlockInfoRepository}
                />
              </div>
            </Tabs.Tab>
          </Tabs>
        </>
      )}
    </>
  )
}
