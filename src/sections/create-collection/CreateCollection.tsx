import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { useCollection } from '@/sections/collection/useCollection'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useLoading } from '../../shared/contexts/loading/LoadingContext'
import { useSession } from '../session/SessionContext'
import { useGetCollectionUserPermissions } from '@/shared/hooks/useGetCollectionUserPermissions'
import { User } from '@/users/domain/models/User'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { CreateCollectionSkeleton } from './CreateCollectionSkeleton'
import { EditCreateCollectionForm } from '../shared/form/EditCreateCollectionForm/EditCreateCollectionForm'
import { useCollectionRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'

interface CreateCollectionProps {
  parentCollectionId: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export function CreateCollection({
  parentCollectionId,
  metadataBlockInfoRepository
}: CreateCollectionProps) {
  const { collectionRepository } = useCollectionRepositories()
  const { t } = useTranslation('createCollection')
  const { isLoading, setIsLoading } = useLoading()
  const { user } = useSession()

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    parentCollectionId
  )

  const {
    collectionUserPermissions,
    isLoading: isLoadingCollectionUserPermissions,
    error: collectionPermissionsError
  } = useGetCollectionUserPermissions({
    collectionIdOrAlias: parentCollectionId,
    collectionRepository: collectionRepository
  })

  const canUserAddCollection = Boolean(collectionUserPermissions?.canAddCollection)

  const isLoadingData = isLoadingCollection || isLoadingCollectionUserPermissions

  useEffect(() => {
    if (!isLoadingData) {
      setIsLoading(false)
    }
  }, [isLoading, isLoadingData, setIsLoading])

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <CreateCollectionSkeleton />
  }

  if (collectionUserPermissions && !canUserAddCollection) {
    return (
      <div className="pt-4">
        <Alert variant="danger" dismissible={false}>
          {t('notAllowedToCreateCollection')}
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
      <RequiredFieldText />

      <EditCreateCollectionForm
        mode="create"
        user={user as User}
        parentCollection={collection}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    </section>
  )
}
