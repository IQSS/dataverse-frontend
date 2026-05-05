import { useTranslation } from 'react-i18next'
import { BreadcrumbsGenerator } from '../../shared/hierarchy/BreadcrumbsGenerator'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { TemplateMetadataForm } from '@/sections/shared/form/TemplateMetadataForm/TemplateMetadataForm'
import { CreateTemplateSkeleton } from './CreateTemplateSkeleton'
import styles from './CreateTemplate.module.scss'

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
      <BreadcrumbsGenerator hierarchy={collection.hierarchy}></BreadcrumbsGenerator>
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
