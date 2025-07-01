import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { EditFeaturedItems } from './EditFeaturedItems'

const collectionRepository = new CollectionJSDataverseRepository()

export class EditFeaturedItemsFactory {
  static create(): ReactElement {
    return <EditFeaturedItemsWithSearchParams />
  }
}

function EditFeaturedItemsWithSearchParams() {
  const { collectionId } = useParams<{ collectionId: string }>()

  return (
    <EditFeaturedItems
      collectionRepository={collectionRepository}
      collectionIdFromParams={collectionId}
    />
  )
}
