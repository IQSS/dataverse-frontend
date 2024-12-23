import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useGetCollectionFeaturedItems } from '../collection/useGetCollectionFeaturedItems'
import { useCollection } from '../collection/useCollection'
import { useLoading } from '../loading/LoadingContext'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { FeaturedItemsForm } from './featured-items-form/FeaturedItemsForm'
import { FeaturedItemsFormHelper } from './featured-items-form/FeaturedItemsFormHelper'
import { FeaturedItemsFormData } from './types'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'

interface CollectionFeaturedItemsProps {
  collectionRepository: CollectionRepository
  collectionIdFromParams: string | undefined
}

export const CollectionFeaturedItems = ({
  collectionRepository,
  collectionIdFromParams
}: CollectionFeaturedItemsProps) => {
  const { t } = useTranslation('collectionFeaturedItems')
  const { setIsLoading } = useLoading()
  const { collection, isLoading } = useCollection(collectionRepository, collectionIdFromParams)
  const {
    collectionFeaturedItems,
    isLoading: isLoadingCollectionFeaturedItems,
    error: errorCollectionFeaturedItems
  } = useGetCollectionFeaturedItems(collectionRepository, collectionIdFromParams)

  useEffect(() => {
    if (!isLoading && collection) {
      setIsLoading(false)
    }
  }, [collection, isLoading, setIsLoading])

  const isLoadingData = isLoading || isLoadingCollectionFeaturedItems

  if (!isLoading && !collection) {
    return <PageNotFound />
  }

  if (isLoadingData || !collection) {
    return <AppLoader />
  }

  if (errorCollectionFeaturedItems) {
    return <Alert variant="danger">{errorCollectionFeaturedItems}</Alert>
  }

  const formDefaultValues: FeaturedItemsFormData = {
    featuredItems: FeaturedItemsFormHelper.defineDefaultFeaturedItems(collectionFeaturedItems)
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={collection.hierarchy}
        withActionItem
        actionItemText="Featured Items"
      />
      <header>
        <h1>{t('pageTitle')}</h1>
      </header>

      <SeparationLine />

      <Alert variant="info">{t('infoMessage')}</Alert>

      <FeaturedItemsForm
        defaultValues={formDefaultValues}
        collectionFeaturedItems={collectionFeaturedItems}
      />
    </section>
  )
}
