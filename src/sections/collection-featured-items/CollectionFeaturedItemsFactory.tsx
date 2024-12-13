import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { CollectionFeaturedItems } from './CollectionFeaturedItems'

const collectionRepository = new CollectionJSDataverseRepository()

export class CollectionFeaturedItemsFactory {
  static create(): ReactElement {
    return <CollectionFeaturedItemsWithSearchParams />
  }
}

function CollectionFeaturedItemsWithSearchParams() {
  const { collectionId } = useParams<{ collectionId: string }>()

  return (
    <CollectionFeaturedItems
      collectionRepository={collectionRepository}
      collectionIdFromParams={collectionId}
    />
  )
}
