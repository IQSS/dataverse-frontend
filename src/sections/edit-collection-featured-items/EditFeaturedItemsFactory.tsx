import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { EditFeaturedItems } from './EditFeaturedItems'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const collectionRepository = new CollectionJSDataverseRepository()

export class EditFeaturedItemsFactory {
  static create(): ReactElement {
    return <EditFeaturedItemsWithSearchParams />
  }
}

function EditFeaturedItemsWithSearchParams() {
  const { collectionId } = useParams<{ collectionId: string }>()

  return (
    <RepositoriesProvider collectionRepository={collectionRepository}>
      <EditFeaturedItems collectionIdFromParams={collectionId} />
    </RepositoriesProvider>
  )
}
