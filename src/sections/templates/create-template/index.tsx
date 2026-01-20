import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Breadcrumb } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { RouteWithParams } from '@/sections/Route.enum'
import { TemplateMetadataForm } from '@/sections/shared/form/TemplateMetadataForm'
import styles from './CreateTemplate.module.scss'
import { CreateTemplateSkeleton } from './CreateTemplateSkeleton'

interface CreateTemplateProps {
  collectionId: string
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  templateRepository: TemplateRepository
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

  return (
    <section className={styles.container}>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: RouteWithParams.COLLECTIONS(collectionId) }}>
          {collection.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: RouteWithParams.COLLECTION_TEMPLATES(collectionId) }}>
          {t('pageTitle')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('createTemplate.breadcrumb')}</Breadcrumb.Item>
      </Breadcrumb>
      <header className={styles.header}>
        <h1>{t('createTemplate.pageTitle')}</h1>
      </header>
      <TemplateMetadataForm
        collectionId={collectionId}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        templateRepository={templateRepository}
      />
    </section>
  )
}
