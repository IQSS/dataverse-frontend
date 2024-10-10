import { ReactElement } from 'react'
import { CollectionFeaturedItems } from './CollectionFeaturedItems'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { useParams } from 'react-router-dom'

const collectionRepository = new CollectionJSDataverseRepository()

export class CollectionFeaturedItemsFactory {
  static create(): ReactElement {
    return <CollectionFeaturedItemsWithSearchParams />
  }
}

function CollectionFeaturedItemsWithSearchParams() {
  const { collectionId = 'root' } = useParams<{ collectionId: string }>()

  return (
    <CollectionFeaturedItems
      collectionRepository={collectionRepository}
      collectionId={collectionId}
    />
  )
}
