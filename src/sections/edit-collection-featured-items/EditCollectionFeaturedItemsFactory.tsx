import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { EditCollectionFeaturedItems } from './EditCollectionFeaturedItems'

const collectionRepository = new CollectionJSDataverseRepository()

export class EditCollectionFeaturedItemsFactory {
  static create(): ReactElement {
    return <EditCollectionFeaturedItemsWithSearchParams />
  }
}

function EditCollectionFeaturedItemsWithSearchParams() {
  const { collectionId } = useParams<{ collectionId: string }>()

  return (
    <EditCollectionFeaturedItems
      collectionRepository={collectionRepository}
      collectionIdFromParams={collectionId}
    />
  )
}
