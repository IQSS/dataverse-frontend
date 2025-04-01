import { CollectionFeaturedItem } from '../models/CollectionFeaturedItem'
import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionFeaturedItemsDTO } from './DTOs/CollectionFeaturedItemsDTO'

export async function updateCollectionFeaturedItems(
  collectionRepository: CollectionRepository,
  featuredItems: CollectionFeaturedItemsDTO,
  collectionIdOrAlias: number | string
): Promise<CollectionFeaturedItem[]> {
  return collectionRepository.updateFeaturedItems(collectionIdOrAlias, featuredItems)
}
