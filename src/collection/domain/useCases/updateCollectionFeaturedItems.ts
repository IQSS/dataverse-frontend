import { FeaturedItem } from '../models/FeaturedItem'
import { CollectionRepository } from '../repositories/CollectionRepository'
import { FeaturedItemsDTO } from './DTOs/FeaturedItemsDTO'

export async function updateCollectionFeaturedItems(
  collectionRepository: CollectionRepository,
  featuredItems: FeaturedItemsDTO,
  collectionIdOrAlias: number | string
): Promise<FeaturedItem[]> {
  return collectionRepository.updateFeaturedItems(collectionIdOrAlias, featuredItems)
}
