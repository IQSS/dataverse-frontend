import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { FeaturedItem } from './FeaturedItem'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

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
    <RepositoriesProvider collectionRepository={collectionRepository}>
      <FeaturedItem
        parentCollectionIdFromParams={parentCollectionId}
        featuredItemId={featuredItemId}
      />
    </RepositoriesProvider>
  )
}
