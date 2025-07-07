import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useGetCollectionMetadataBlocksInfo } from '@/shared/hooks/useGetCollectionMetadataBlocksInfo'
import { useCollection } from '../collection/useCollection'
import { useLoading } from '../loading/LoadingContext'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { AdvancedSearchForm } from './advanced-search-form/AdvancedSearchForm'

interface AdvancedSearchProps {
  collectionId: string
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionPageQuery: string | null
}

export const AdvancedSearch = ({
  collectionId,
  collectionRepository,
  metadataBlockInfoRepository,
  collectionPageQuery
}: AdvancedSearchProps) => {
  const { t } = useTranslation('advancedSearch')
  const { setIsLoading } = useLoading()

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )
  const {
    metadataBlocksInfo,
    isLoading: isLoadingCollectionMetadataBlocks,
    error: errorCollectionMetadataBlocks
  } = useGetCollectionMetadataBlocksInfo({
    collectionId,
    metadataBlockInfoRepository
  })

  const isLoadingData = isLoadingCollection || isLoadingCollectionMetadataBlocks

  useEffect(() => {
    if (!isLoadingData) {
      setIsLoading(false)
    }
  }, [isLoadingData, setIsLoading])

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (errorCollectionMetadataBlocks) {
    return (
      <div className="pt-4">
        <Alert variant="danger">{errorCollectionMetadataBlocks}</Alert>
      </div>
    )
  }

  if (isLoadingData || !collection || errorCollectionMetadataBlocks?.length === 0) {
    return <AppLoader />
  }

  // TODO:ME - Encapsulate form to define defaultValues based on metadata blocks and collectionPageQuery, follow JSF convention for URL

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={collection?.hierarchy}
        withActionItem
        actionItemText={t('pageTitle')}
      />
      <header>
        <h1>{t('pageTitle')}</h1>
      </header>

      <SeparationLine />

      <AdvancedSearchForm metadataBlocks={metadataBlocksInfo} />
    </section>
  )
}
