import { FeaturedItem } from '../models/FeaturedItem'
import { CollectionRepository } from '../repositories/CollectionRepository'

export async function getFeaturedItems(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias?: number | string
): Promise<FeaturedItem[]> {
  return collectionRepository.getFeaturedItems(collectionIdOrAlias)
}
