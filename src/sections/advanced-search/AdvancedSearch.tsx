import { useEffect, useState } from 'react'
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
import {
  AdvancedSearchForm,
  AdvancedSearchFormData
} from './advanced-search-form/AdvancedSearchForm'
import { MetadataFieldsHelper } from '../shared/form/DatasetMetadataForm/MetadataFieldsHelper'
import { AdvancedSearchHelper } from './AdvancedSearchHelper'

interface AdvancedSearchProps {
  collectionId: string
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionFilterQueries?: string
}

export const AdvancedSearch = ({
  collectionId,
  collectionRepository,
  metadataBlockInfoRepository,
  collectionFilterQueries
}: AdvancedSearchProps) => {
  const { t } = useTranslation('advancedSearch')
  const { setIsLoading } = useLoading()
  const [previousAdvancedSearchFormData, setPreviousAdvancedSearchFormData] =
    useState<AdvancedSearchFormData | null>(null)

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

  useEffect(() => {
    const previousAdvancedSearchData =
      AdvancedSearchHelper.getPreviousAdvancedSearchQueryFromLocalStorage()

    // Check if the local storage data matches the current collectionId
    if (previousAdvancedSearchData?.collectionId === collectionId) {
      setPreviousAdvancedSearchFormData(previousAdvancedSearchData.formData)
    } else {
      // Otherwise, delete the local storage entry
      AdvancedSearchHelper.clearPreviousAdvancedSearchQueryFromLocalStorage()
    }
  }, [collectionId])

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

  if (isLoadingData || isLoadingCollectionMetadataBlocks || !collection) {
    return <AppLoader />
  }

  const normalizedMetadataBlocksInfo =
    MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(metadataBlocksInfo)

  const formDefaultValues = AdvancedSearchHelper.getFormDefaultValues(
    normalizedMetadataBlocksInfo,
    previousAdvancedSearchFormData
  )

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

      <AdvancedSearchForm
        collectionId={collectionId}
        formDefaultValues={formDefaultValues}
        metadataBlocks={normalizedMetadataBlocksInfo}
        collectionFilterQueries={collectionFilterQueries}
      />
    </section>
  )
}
