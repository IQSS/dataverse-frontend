import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Tabs } from '@iqss/dataverse-design-system'
import { useDataset } from '../dataset/DatasetContext'
import { useLoading } from '../loading/LoadingContext'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { HostCollection } from './HostCollection'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import styles from './EditDatasetMetadata.module.scss'

interface EditDatasetMetadataProps {
  who?: string
}

export const EditDatasetMetadata = ({ who: _who }: EditDatasetMetadataProps) => {
  const { t } = useTranslation('editDatasetMetadata')
  const { dataset, isLoading } = useDataset()
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

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
          <HostCollection datasetHierarchy={dataset.hierarchy} />
          <SeparationLine />
          <Tabs defaultActiveKey="metadata">
            <Tabs.Tab eventKey="metadata" title={t('metadata')}>
              <div className={styles['tab-container']}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi saepe iure
                consequatur asperiores doloribus sapiente eius aspernatur hic officia illum
                veritatis dolor molestiae ex perspiciatis accusamus ipsam minus animi, minima
                molestias natus quaerat aliquam ea. Eius nisi ut hic laudantium quam, veniam porro
                consequatur iure animi tenetur quod incidunt error harum debitis, pariatur
                temporibus ipsa nobis cupiditate quas nihil rerum distinctio ullam! Fugit amet ipsum
                omnis veniam, ad neque inventore. Laboriosam maiores autem officiis, aut atque natus
                fugit.
              </div>
            </Tabs.Tab>
          </Tabs>
        </>
      )}
    </>
  )
}
