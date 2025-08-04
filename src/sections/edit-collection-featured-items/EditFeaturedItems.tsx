import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useGetFeaturedItems } from '../collection/useGetFeaturedItems'
import { useCollection } from '../collection/useCollection'
import { useLoading } from '../loading/LoadingContext'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { FeaturedItemsForm } from './featured-items-form/FeaturedItemsForm'
import { FeaturedItemsFormHelper } from './featured-items-form/FeaturedItemsFormHelper'
import { FeaturedItemsFormData } from './types'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'

interface EditFeaturedItemsProps {
  collectionRepository: CollectionRepository
  collectionIdFromParams: string | undefined
}

export const EditFeaturedItems = ({
  collectionRepository,
  collectionIdFromParams
}: EditFeaturedItemsProps) => {
  const { t } = useTranslation('editFeaturedItems')
  const { setIsLoading } = useLoading()
  const { collection, isLoading } = useCollection(collectionRepository, collectionIdFromParams)
  const {
    featuredItems,
    isLoading: isLoadingFeaturedItems,
    error: errorFeaturedItems
  } = useGetFeaturedItems(collectionRepository, collectionIdFromParams)

  const isLoadingData = isLoading || isLoadingFeaturedItems

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

  if (errorFeaturedItems) {
    return <Alert variant="danger">{errorFeaturedItems}</Alert>
  }

  const formDefaultValues: FeaturedItemsFormData = {
    featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(featuredItems)
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

      {featuredItems.length === 0 && <Alert variant="info">{t('infoMessage')}</Alert>}

      <FeaturedItemsForm
        collectionId={collection.id}
        defaultValues={formDefaultValues}
        initialExistingFeaturedItems={featuredItems}
        collectionRepository={collectionRepository}
      />
    </section>
  )
}
