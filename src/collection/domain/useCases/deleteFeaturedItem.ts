import { CollectionRepository } from '../repositories/CollectionRepository'

export async function deleteFeaturedItem(
  collectionRepository: CollectionRepository,
  featuredItemId: number
): Promise<void> {
  return collectionRepository.deleteFeaturedItem(featuredItemId)
}
