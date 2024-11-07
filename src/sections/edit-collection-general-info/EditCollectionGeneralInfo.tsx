import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useGetCollectionUserPermissions } from '@/shared/hooks/useGetCollectionUserPermissions'
import { useLoading } from '../loading/LoadingContext'
import { useSession } from '../session/SessionContext'
import { useCollection } from '../collection/useCollection'
import { PageNotFound } from '../page-not-found/PageNotFound'

interface EditCollectionGeneralInfoProps {
  collectionId: string
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

// TODO:ME - Move collection form to a shared component and make everything work again after, tests stories etc.
// TODO:ME - Integrated shared form here.

export const EditCollectionGeneralInfo = ({
  collectionId,
  collectionRepository,
  metadataBlockInfoRepository
}: EditCollectionGeneralInfoProps) => {
  const { t } = useTranslation('editCollectionGeneralInfo')
  const { isLoading, setIsLoading } = useLoading()
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

  if (!isLoadingCollection && !collection) {
    return <PageNotFound />
  }

  if (collectionUserPermissions && !canUserEditCollection) {
    return (
      <div className="pt-4" data-testid="not-allowed-to-edit-collection-alert">
        <Alert variant="danger" dismissible={false}>
          {t('notAllowedToEditCollection')}
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <p>Edit collection general info</p>
    </div>
  )
}
