import { useCollection } from '../collection/useCollection'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { useTranslation } from 'react-i18next'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { CollectionForm, CollectionFormProps } from './collection-form'
import { useEffect } from 'react'
import { useLoading } from '../loading/LoadingContext'

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

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    ownerCollectionId
  )

  console.log({ collection, isLoadingCollection })

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
  const formDefaultValues: CollectionFormProps['defaultValues'] = {
    parentCollectionName: collection.name,
    name: 'The Nameeeee',
    alias: 'Some Alias',
    type: 'Department',
    contacts: [{ value: '' }],
    affiliation: 'Some Affi',
    storage: 'Local (Default)',
    description: 'Some Description'
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
