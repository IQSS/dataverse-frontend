import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionFeaturedItemsDTO } from './DTOs/CollectionFeaturedItemsDTO'

export async function updateCollectionFeaturedItems(
  collectionRepository: CollectionRepository,
  featuredItems: CollectionFeaturedItemsDTO,
  collectionId: string
): Promise<void> {
  return collectionRepository.updateFeaturedItems(collectionId, featuredItems)
}
