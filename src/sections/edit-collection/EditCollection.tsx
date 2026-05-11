import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useGetCollectionUserPermissions } from '@/shared/hooks/useGetCollectionUserPermissions'
import { useLoading } from '../../shared/contexts/loading/LoadingContext'
import { useSession } from '../session/SessionContext'
import { useCollection } from '../collection/useCollection'
import { User } from '@/users/domain/models/User'
import { CollectionHelper } from '../collection/CollectionHelper'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { EditCreateCollectionForm } from '../shared/form/EditCreateCollectionForm/EditCreateCollectionForm'
import { EditCollectionSkeleton } from './EditCollectionSkeleton'
import { useCollectionRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'

interface EditCollectionProps {
  collectionId: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export const EditCollection = ({
  collectionId,
  metadataBlockInfoRepository
}: EditCollectionProps) => {
  const { collectionRepository } = useCollectionRepositories()
  const { t } = useTranslation('editCollection')
  const { setIsLoading } = useLoading()
  const { user } = useSession()

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )

  const {
    collectionUserPermissions,
    isLoading: isLoadingCollectionUserPermissions,
    error: collectionPermissionsError
  } = useGetCollectionUserPermissions({
    collectionIdOrAlias: collectionId,
    collectionRepository: collectionRepository
  })
  const canUserEditCollection = Boolean(collectionUserPermissions?.canEditCollection)

  const isLoadingData = isLoadingCollection || isLoadingCollectionUserPermissions

  useEffect(() => {
    if (!isLoadingData) {
      setIsLoading(false)
    }
  }, [setIsLoading, isLoadingData])

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <EditCollectionSkeleton />
  }

  if (collectionUserPermissions && !canUserEditCollection) {
    return (
      <div className="pt-4">
        <Alert variant="danger" dismissible={false}>
          {t('notAllowedToEditCollection')}
        </Alert>
      </div>
    )
  }

  if (collectionPermissionsError) {
    return (
      <Alert variant="danger" dismissible={false}>
        {collectionPermissionsError}
      </Alert>
    )
  }

  const parentCollection = CollectionHelper.getParentCollection(collection.hierarchy)

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

      <Alert variant="info" customHeading={t('infoAlert.heading')}>
        {t('infoAlert.text')}
      </Alert>

      <RequiredFieldText />

      <EditCreateCollectionForm
        mode="edit"
        user={user as User}
        collection={collection}
        parentCollection={
          parentCollection
            ? {
                id: parentCollection.id,
                name: parentCollection.name
              }
            : undefined
        }
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    </section>
  )
}
