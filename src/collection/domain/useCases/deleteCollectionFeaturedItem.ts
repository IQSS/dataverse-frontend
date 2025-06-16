import { CollectionRepository } from '../repositories/CollectionRepository'

export async function deleteCollectionFeaturedItem(
  collectionRepository: CollectionRepository,
  featuredItemId: number
): Promise<void> {
  return collectionRepository.deleteFeaturedItem(featuredItemId)
}
