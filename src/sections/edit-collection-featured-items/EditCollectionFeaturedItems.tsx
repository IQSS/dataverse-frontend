import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useGetCollectionFeaturedItems } from '../collection/useGetCollectionFeaturedItems'
import { useCollection } from '../collection/useCollection'
import { useLoading } from '../loading/LoadingContext'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { FeaturedItemsForm } from './featured-items-form/FeaturedItemsForm'
import { FeaturedItemsFormHelper } from './featured-items-form/FeaturedItemsFormHelper'
import { FeaturedItemsFormData } from './types'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'

interface EditCollectionFeaturedItemsProps {
  collectionRepository: CollectionRepository
  collectionIdFromParams: string | undefined
}

export const EditCollectionFeaturedItems = ({
  collectionRepository,
  collectionIdFromParams
}: EditCollectionFeaturedItemsProps) => {
  const { t } = useTranslation('editCollectionFeaturedItems')
  const { setIsLoading } = useLoading()
  const { collection, isLoading } = useCollection(collectionRepository, collectionIdFromParams)
  const {
    collectionFeaturedItems,
    isLoading: isLoadingCollectionFeaturedItems,
    error: errorCollectionFeaturedItems
  } = useGetCollectionFeaturedItems(collectionRepository, collectionIdFromParams)

  const isLoadingData = isLoading || isLoadingCollectionFeaturedItems

  useEffect(() => {
    if (!isLoadingData) {
      setIsLoading(false)
    }
  }, [isLoadingData, setIsLoading])

  if (!isLoading && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <AppLoader />
  }

  if (errorCollectionFeaturedItems) {
    return <Alert variant="danger">{errorCollectionFeaturedItems}</Alert>
  }

  const formDefaultValues: FeaturedItemsFormData = {
    featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(collectionFeaturedItems)
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={collection.hierarchy}
        withActionItem
        actionItemText={t('pageTitle')}
      />
      <header>
        <h1>{t('pageTitle')}</h1>
      </header>

      <SeparationLine />

      {collectionFeaturedItems.length === 0 && <Alert variant="info">{t('infoMessage')}</Alert>}

      <FeaturedItemsForm
        collectionId={collection.id}
        defaultValues={formDefaultValues}
        collectionFeaturedItems={collectionFeaturedItems}
        collectionRepository={collectionRepository}
      />
    </section>
  )
}
