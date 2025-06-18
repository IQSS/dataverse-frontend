import { FeaturedItem } from '../models/FeaturedItem'
import { CollectionRepository } from '../repositories/CollectionRepository'

export async function getCollectionFeaturedItems(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias?: number | string
): Promise<FeaturedItem[]> {
  return collectionRepository.getFeaturedItems(collectionIdOrAlias)
}
