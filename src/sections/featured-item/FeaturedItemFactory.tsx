import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { FeaturedItem } from './FeaturedItem'

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
      parentCollectionIdFromParams={parentCollectionId}
      featuredItemId={featuredItemId}
    />
  )
}
