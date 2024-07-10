import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCollection } from '../collection/useCollection'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { useLoading } from '../loading/LoadingContext'
import { useSession } from '../session/SessionContext'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { CollectionForm, CollectionFormData } from './collection-form'

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

  // TODO:ME If is not loading and collection is not found, show a message and navigate to the root collection
  // One good thing would be add toastify to show messages on top of the page for this kind of things

  useEffect(() => {
    if (!isLoadingCollection) {
      setIsLoading(false)
    }
  }, [isLoading, isLoadingCollection, setIsLoading])

  if (!isLoading && !collection) {
    return <p>Owner Collection not found</p>
  }

  // TODO:ME Create Skeleton
  if (isLoading || !collection) {
    return <p>Loading...</p>
  }
  // TODO:ME name = user name, affiliation = user affiliation, first email = user email
  const formDefaultValues: Partial<CollectionFormData> = {
    hostCollection: collection.name,
    name: user?.displayName ? `${user?.displayName} Collection` : '',
    alias: '',
    type: undefined,
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
      <RequiredFieldText />
      <CollectionForm defaultValues={formDefaultValues} />
    </section>
  )
}

export default CreateCollection
