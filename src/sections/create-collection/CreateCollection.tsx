import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { useCollection } from '../collection/useCollection'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { useLoading } from '../loading/LoadingContext'
import { useSession } from '../session/SessionContext'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { CollectionForm, CollectionFormData } from './collection-form/CollectionForm'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { CreateCollectionSkeleton } from './CreateCollectionSkeleton'
import { useGetCollectionUserPermissions } from '../../shared/hooks/useGetCollectionUserPermissions'

interface CreateCollectionProps {
  ownerCollectionId: string
  collectionRepository: CollectionRepository
}

export function CreateCollection({
  ownerCollectionId,
  collectionRepository
}: CreateCollectionProps) {
  const { t } = useTranslation('createCollection')
  const { isLoading, setIsLoading } = useLoading()
  const { user } = useSession()

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    ownerCollectionId
  )

  const { collectionUserPermissions, isLoading: isLoadingCollectionUserPermissions } =
    useGetCollectionUserPermissions({
      collectionIdOrAlias: ownerCollectionId,
      collectionRepository: collectionRepository
    })

  const canUserAddCollection = Boolean(collectionUserPermissions?.canAddCollection)

  useEffect(() => {
    if (!isLoadingCollection && !isLoadingCollectionUserPermissions) {
      setIsLoading(false)
    }
  }, [isLoading, isLoadingCollection, isLoadingCollectionUserPermissions, setIsLoading])

  if (!isLoadingCollection && !collection) {
    return <PageNotFound />
  }

  if (isLoadingCollection || isLoadingCollectionUserPermissions || !collection) {
    return <CreateCollectionSkeleton />
  }

  if (collectionUserPermissions && !canUserAddCollection) {
    return (
      <div className="pt-4" data-testid="not-allowed-to-create-collection-alert">
        <Alert variant="danger" dismissible={false}>
          {t('notAllowedToCreateCollection')}
        </Alert>
      </div>
    )
  }

  const formDefaultValues: CollectionFormData = {
    hostCollection: collection.name,
    name: user?.displayName ? `${user?.displayName} Collection` : '',
    alias: '',
    type: '',
    contacts: [{ value: user?.email ?? '' }],
    affiliation: user?.affiliation ?? '',
    storage: 'Local (Default)',
    description: ''
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

      <CollectionForm
        collectionRepository={collectionRepository}
        ownerCollectionId={ownerCollectionId}
        defaultValues={formDefaultValues}
      />
    </section>
  )
}
