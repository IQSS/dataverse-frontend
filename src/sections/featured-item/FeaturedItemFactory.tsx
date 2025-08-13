import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { FeaturedItem } from './FeaturedItem'

const collectionRepository = new CollectionJSDataverseRepository()

export class FeaturedItemFactory {
  static create(): ReactElement {
    return <FeaturedItemWithParams />
  }
}

function FeaturedItemWithParams() {
  const { parentCollectionId, featuredItemId } = useParams<{ parentCollectionId: string }>() as {
    parentCollectionId: string
    featuredItemId: string
  }

  return (
    <FeaturedItem
      collectionRepository={collectionRepository}
      parentCollectionIdFromParams={parentCollectionId}
      featuredItemId={featuredItemId}
    />
  )
}
