import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, Breadcrumb } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useCollection } from '@/sections/collection/useCollection'
import { useGetTemplate } from '@/templates/domain/hooks/useGetTemplate'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { TemplateMetadataForm } from '@/sections/shared/form/TemplateMetadataForm/TemplateMetadataForm'
import { RouteWithParams } from '@/sections/Route.enum'
import { EditTemplateMetadataSkeleton } from './EditTemplateMetadataSkeleton'
import styles from '../create-template/CreateTemplate.module.scss'

interface EditTemplateMetadataProps {
  collectionId: string
  templateId: number
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  templateRepository: TemplateRepository
}

export const EditTemplateMetadata = ({
  collectionId,
  templateId,
  collectionRepository,
  templateRepository,
  metadataBlockInfoRepository
}: EditTemplateMetadataProps) => {
  const { t } = useTranslation('datasetTemplates')
  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )
  const { template, isLoadingTemplate, errorGetTemplate } = useGetTemplate({
    templateRepository,
    templateId
  })

  const isLoadingData = isLoadingCollection || isLoadingTemplate

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <EditTemplateMetadataSkeleton />
  }

  if (errorGetTemplate || !template) {
    return (
      <section className={styles.container}>
        <Alert variant="danger">
          {errorGetTemplate ?? t('editTemplate.errors.loadingTemplate')}
        </Alert>
      </section>
    )
  }

  return (
    <section className={styles.container}>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: RouteWithParams.COLLECTIONS(collectionId) }}>
          {collectionId}
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: RouteWithParams.COLLECTION_TEMPLATES(collectionId) }}>
          {t('pageTitle')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('editTemplate.metadataPageTitle')}</Breadcrumb.Item>
      </Breadcrumb>
      <header className={styles.header}>
        <h1>{t('editTemplate.metadataPageTitle')}</h1>
      </header>
      <TemplateMetadataForm
        mode="edit"
        collectionId={collectionId}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        templateRepository={templateRepository}
        template={template}
      />
    </section>
  )
}
