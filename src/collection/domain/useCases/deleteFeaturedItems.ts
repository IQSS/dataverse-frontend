import { CollectionRepository } from '../repositories/CollectionRepository'

export async function deleteFeaturedItems(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string
): Promise<void> {
  return collectionRepository.deleteFeaturedItems(collectionIdOrAlias)
}
