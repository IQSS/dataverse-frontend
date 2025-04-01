import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CustomFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { useGetCollectionFeaturedItems } from '../collection/useGetCollectionFeaturedItems'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { useLoading } from '../loading/LoadingContext'
import { FeaturedItemView } from './featured-item-view/FeaturedItemView'
import { useCollection } from '../collection/useCollection'

interface FeaturedItemProps {
  collectionRepository: CollectionRepository
  parentCollectionIdFromParams: string
  featuredItemId: string
}

export const FeaturedItem = ({
  collectionRepository,
  parentCollectionIdFromParams,
  featuredItemId
}: FeaturedItemProps) => {
  const { setIsLoading } = useLoading()
  const { t } = useTranslation('featuredItem')

  const {
    collectionFeaturedItems,
    isLoading: isLoadingFeaturedItems,
    error
  } = useGetCollectionFeaturedItems(collectionRepository, parentCollectionIdFromParams)

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    parentCollectionIdFromParams
  )

  useEffect(() => {
    if (!isLoadingFeaturedItems && !isLoadingCollection) {
      setIsLoading(false)
    }
  }, [isLoadingFeaturedItems, isLoadingCollection, setIsLoading])

  if (isLoadingFeaturedItems || isLoadingCollection) {
    return <AppLoader />
  }

  const featuredItemFoundById = collectionFeaturedItems?.find(
    (featuredItem) => featuredItem.id === Number(featuredItemId)
  )

  if (error || !collectionFeaturedItems || !featuredItemFoundById || !collection) {
    return (
      <Alert variant="danger" dismissible={false}>
        {t('error')}
      </Alert>
    )
  }

  // TODO: Add in next iteration when we actually have featured items differentiated by type
  //   if (featuredItemFoundById.type !== 'custom') {
  //     return (
  //       <Alert variant="danger" dismissible={false}>
  //         This page is only for custom featured items.
  //       </Alert>
  //     )
  //   }

  return (
    <FeaturedItemView
      featuredItem={featuredItemFoundById as CustomFeaturedItem}
      showBreadcrumbs
      collectionHierarchy={collection.hierarchy}
    />
  )
}
