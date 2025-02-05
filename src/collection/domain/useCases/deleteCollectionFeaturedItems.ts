import { CollectionRepository } from '../repositories/CollectionRepository'

export async function deleteCollectionFeaturedItems(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string
): Promise<void> {
  return collectionRepository.deleteFeaturedItems(collectionIdOrAlias)
}
