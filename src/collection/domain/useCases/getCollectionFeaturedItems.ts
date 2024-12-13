import { CollectionFeaturedItem } from '../models/CollectionFeaturedItem'
import { CollectionRepository } from '../repositories/CollectionRepository'

export async function getCollectionFeaturedItems(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias?: number | string
): Promise<CollectionFeaturedItem[]> {
  return collectionRepository.getFeaturedItems(collectionIdOrAlias)
}
