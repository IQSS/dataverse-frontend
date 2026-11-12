import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { TemplateMetadataForm } from '@/sections/shared/form/TemplateMetadataForm/TemplateMetadataForm'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import { useLoading } from '@/shared/contexts/loading/LoadingContext'
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
  const { setIsLoading } = useLoading()
  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )

  const isLoadingData = isLoadingCollection

  useEffect(() => {
    setIsLoading(isLoadingData)
  }, [isLoadingData, setIsLoading])

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <CreateTemplateSkeleton />
  }

  return (
    <section className={styles.container}>
      <BreadcrumbsGenerator
        hierarchy={collection.hierarchy}
        withActionItem
        actionItemText={t('createTemplate.pageTitle')}
      />
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
