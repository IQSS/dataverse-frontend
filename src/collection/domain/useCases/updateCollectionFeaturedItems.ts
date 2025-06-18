import { FeaturedItem } from '../models/FeaturedItem'
import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionFeaturedItemsDTO } from './DTOs/CollectionFeaturedItemsDTO'

export async function updateCollectionFeaturedItems(
  collectionRepository: CollectionRepository,
  featuredItems: CollectionFeaturedItemsDTO,
  collectionIdOrAlias: number | string
): Promise<FeaturedItem[]> {
  return collectionRepository.updateFeaturedItems(collectionIdOrAlias, featuredItems)
}
