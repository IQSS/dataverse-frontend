import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Breadcrumb } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { TemplateMetadataForm } from '@/sections/shared/form/TemplateMetadataForm/TemplateMetadataForm'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { Route, RouteWithParams } from '@/sections/Route.enum'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { CreateTemplateSkeleton } from './CreateTemplateSkeleton'
import styles from './CreateTemplate.module.scss'

interface CreateTemplateProps {
  collectionId: string
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  templateRepository: TemplateRepository
}

const dvObjectTypeToRoute: Record<DvObjectType, Route> = {
  dataset: Route.DATASETS,
  collection: Route.COLLECTIONS,
  file: Route.FILES
}

export const CreateTemplate = ({
  collectionId,
  collectionRepository,
  templateRepository,
  metadataBlockInfoRepository
}: CreateTemplateProps) => {
  const { t } = useTranslation('datasetTemplates')
  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )

  const isLoadingData = isLoadingCollection

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <CreateTemplateSkeleton />
  }

  const hierarchyItems = collection.hierarchy.toArray()

  return (
    <section className={styles.container}>
      <Breadcrumb className={styles.breadcrumb}>
        {hierarchyItems.map((item, index) => {
          const isFirst = index === 0
          if (isFirst) {
            return (
              <Breadcrumb.Item
                key={index}
                linkAs={LinkToPage}
                linkProps={{
                  page: Route.COLLECTIONS_BASE,
                  children: <>{item.name}</>
                }}>
                {item.name}
              </Breadcrumb.Item>
            )
          }
          return (
            <Breadcrumb.Item
              key={index}
              linkAs={LinkToPage}
              linkProps={{
                page: dvObjectTypeToRoute[item.type],
                type: item.type,
                searchParams: {
                  ...(item.persistentId ? { persistentId: item.persistentId } : { id: item.id }),
                  ...(item.version ? { version: item.version } : {})
                },
                children: <>{item.name}</>
              }}>
              {item.name}
            </Breadcrumb.Item>
          )
        })}
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: RouteWithParams.COLLECTION_TEMPLATES(collectionId) }}>
          {t('pageTitle')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('createTemplate.pageTitle')}</Breadcrumb.Item>
      </Breadcrumb>
      <header className={styles.header}>
        <h1>{t('createTemplate.pageTitle')}</h1>
      </header>
      <TemplateMetadataForm
        mode="create"
        collectionId={collectionId}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        templateRepository={templateRepository}
      />
    </section>
  )
}
