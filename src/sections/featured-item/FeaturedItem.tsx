import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'

interface FeaturedItemProps {
  collectionRepository: CollectionRepository
  parentCollectionIdFromParams: string
}

export const FeaturedItem = ({
  collectionRepository,
  parentCollectionIdFromParams
}: FeaturedItemProps) => {
  return (
    <div>
      <h1>Featured Item</h1>
    </div>
  )
}
